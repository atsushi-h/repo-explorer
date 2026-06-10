import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { GetRepositoryResponse } from '@/external/dto/repositories.dto'
import { getRepositoryQuery } from '@/external/handler/repositories.query.server'
import { NotFoundError, RateLimitError } from '@/external/utils/errors'
import { fetchRepositoryDetail } from '.'

vi.mock('@/external/handler/repositories.query.server')

const mockRepo: GetRepositoryResponse = {
  id: 1,
  name: 'hello-world',
  fullName: 'octocat/hello-world',
  description: 'My first repository',
  url: 'https://github.com/octocat/hello-world',
  owner: {
    login: 'octocat',
    avatarUrl: 'https://avatars.githubusercontent.com/u/583231',
    url: 'https://github.com/octocat',
  },
  language: 'JavaScript',
  stargazersCount: 100,
  watchersCount: 50,
  forksCount: 30,
  openIssuesCount: 5,
  topics: [],
  updatedAt: '2024-01-01T00:00:00Z',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('fetchRepositoryDetail', () => {
  it('正常に取得できた場合 data と errorType: null を返す', async () => {
    vi.mocked(getRepositoryQuery).mockResolvedValue(mockRepo)
    const result = await fetchRepositoryDetail('octocat', 'hello-world')
    expect(result).toEqual({ data: mockRepo, errorType: null })
  })

  it('NotFoundError のとき data: null, errorType: notFound を返す', async () => {
    vi.mocked(getRepositoryQuery).mockRejectedValue(new NotFoundError())
    const result = await fetchRepositoryDetail('octocat', 'missing')
    expect(result).toEqual({ data: null, errorType: 'notFound' })
  })

  it('RateLimitError のとき data: null, errorType: rateLimit を返す', async () => {
    vi.mocked(getRepositoryQuery).mockRejectedValue(new RateLimitError())
    const result = await fetchRepositoryDetail('octocat', 'hello-world')
    expect(result).toEqual({ data: null, errorType: 'rateLimit' })
  })

  it('その他のエラーのとき data: null, errorType: error を返す', async () => {
    vi.mocked(getRepositoryQuery).mockRejectedValue(new Error('Network Error'))
    const result = await fetchRepositoryDetail('octocat', 'hello-world')
    expect(result).toEqual({ data: null, errorType: 'error' })
  })
})
