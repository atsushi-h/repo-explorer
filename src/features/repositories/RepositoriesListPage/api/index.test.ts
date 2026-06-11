import { beforeEach, describe, expect, it, vi } from 'vitest'
import { searchRepositoriesQuery } from '@/external/handler/repositories.query.server'
import { RateLimitError } from '@/external/utils/errors'
import { fetchRepositoryListResult } from '.'

vi.mock('@/external/handler/repositories.query.server')
// cacheLife() は use cache スコープ外(Vitest 実行時)で throw するためモックする
vi.mock('next/cache', () => ({ cacheLife: vi.fn() }))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('fetchRepositoryListResult', () => {
  it('query が空文字のとき idle を返す', async () => {
    const result = await fetchRepositoryListResult('', 1)
    expect(result).toEqual({ status: 'idle' })
    expect(searchRepositoriesQuery).not.toHaveBeenCalled()
  })

  it('検索結果がある場合 success を返す', async () => {
    vi.mocked(searchRepositoriesQuery).mockResolvedValue({
      totalCount: 30,
      incompleteResults: false,
      items: [],
    })
    const result = await fetchRepositoryListResult('typescript', 2)
    expect(result).toEqual({
      status: 'success',
      data: { totalCount: 30, incompleteResults: false, items: [] },
      page: 2,
      totalPages: 3,
    })
  })

  it('totalCount が 0 のとき noResults を返す', async () => {
    vi.mocked(searchRepositoriesQuery).mockResolvedValue({
      totalCount: 0,
      incompleteResults: false,
      items: [],
    })
    const result = await fetchRepositoryListResult('unknown-repo-xyz', 1)
    expect(result).toEqual({ status: 'noResults', query: 'unknown-repo-xyz' })
  })

  it('RateLimitError のとき rateLimit を返す', async () => {
    vi.mocked(searchRepositoriesQuery).mockRejectedValue(new RateLimitError())
    const result = await fetchRepositoryListResult('typescript', 1)
    expect(result).toEqual({ status: 'rateLimit' })
  })

  it('その他の Error のとき error を返す', async () => {
    vi.mocked(searchRepositoriesQuery).mockRejectedValue(new Error('Network Error'))
    const result = await fetchRepositoryListResult('typescript', 1)
    expect(result).toEqual({ status: 'error', message: 'Network Error' })
  })

  it('Error 以外が throw されたとき message が空文字の error を返す', async () => {
    vi.mocked(searchRepositoriesQuery).mockRejectedValue('unknown error')
    const result = await fetchRepositoryListResult('typescript', 1)
    expect(result).toEqual({ status: 'error', message: '' })
  })

  it('totalCount が 1000 を超えても totalPages が 100 を超えない', async () => {
    vi.mocked(searchRepositoriesQuery).mockResolvedValue({
      totalCount: 9999,
      incompleteResults: true,
      items: [],
    })
    const result = await fetchRepositoryListResult('popular', 1)
    expect(result).toMatchObject({ status: 'success', totalPages: 100 })
  })
})
