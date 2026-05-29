import { describe, expect, it } from 'vitest'
import {
  GetRepositoryRequestSchema,
  GetRepositoryResponseSchema,
  SearchRepositoriesRequestSchema,
  SearchRepositoriesResponseSchema,
} from '@/external/dto/repositories.dto'

const validRepository = {
  id: 1296269,
  name: 'Hello-World',
  fullName: 'octocat/Hello-World',
  description: 'This your first repo!',
  url: 'https://github.com/octocat/Hello-World',
  owner: {
    login: 'octocat',
    avatarUrl: 'https://github.com/images/error/octocat_happy.gif',
    url: 'https://github.com/octocat',
  },
}

describe('SearchRepositoriesRequestSchema', () => {
  it('queryのみ指定してパースできる', () => {
    const result = SearchRepositoriesRequestSchema.safeParse({ query: 'react' })
    expect(result.success).toBe(true)
  })

  it('query + page + perPage すべて指定してパースできる', () => {
    const result = SearchRepositoriesRequestSchema.safeParse({
      query: 'react',
      page: 2,
      perPage: 50,
    })
    expect(result.success).toBe(true)
  })

  it('queryが空文字でエラーになる', () => {
    const result = SearchRepositoriesRequestSchema.safeParse({ query: '' })
    expect(result.success).toBe(false)
  })

  it('pageが0（min 1 未満）でエラーになる', () => {
    const result = SearchRepositoriesRequestSchema.safeParse({ query: 'react', page: 0 })
    expect(result.success).toBe(false)
  })

  it('pageが小数（非int）でエラーになる', () => {
    const result = SearchRepositoriesRequestSchema.safeParse({ query: 'react', page: 1.5 })
    expect(result.success).toBe(false)
  })

  it('perPageが0（min 1 未満）でエラーになる', () => {
    const result = SearchRepositoriesRequestSchema.safeParse({ query: 'react', perPage: 0 })
    expect(result.success).toBe(false)
  })

  it('perPageが101（max 100 超過）でエラーになる', () => {
    const result = SearchRepositoriesRequestSchema.safeParse({ query: 'react', perPage: 101 })
    expect(result.success).toBe(false)
  })

  it('perPageが小数（非int）でエラーになる', () => {
    const result = SearchRepositoriesRequestSchema.safeParse({ query: 'react', perPage: 1.5 })
    expect(result.success).toBe(false)
  })
})

describe('GetRepositoryRequestSchema', () => {
  it('有効なowner/repoでパースできる', () => {
    const result = GetRepositoryRequestSchema.safeParse({ owner: 'octocat', repo: 'Hello-World' })
    expect(result.success).toBe(true)
  })

  it('ownerが空文字でエラーになる', () => {
    const result = GetRepositoryRequestSchema.safeParse({ owner: '', repo: 'Hello-World' })
    expect(result.success).toBe(false)
  })

  it('repoが空文字でエラーになる', () => {
    const result = GetRepositoryRequestSchema.safeParse({ owner: 'octocat', repo: '' })
    expect(result.success).toBe(false)
  })
})

describe('GetRepositoryResponseSchema', () => {
  it('全フィールド有効でパースできる', () => {
    expect(GetRepositoryResponseSchema.safeParse(validRepository).success).toBe(true)
  })

  it('descriptionがnullでもパースできる', () => {
    const result = GetRepositoryResponseSchema.safeParse({ ...validRepository, description: null })
    expect(result.success).toBe(true)
  })

  it('ownerがnullでもパースできる', () => {
    const result = GetRepositoryResponseSchema.safeParse({ ...validRepository, owner: null })
    expect(result.success).toBe(true)
  })

  it('urlが無効なURL形式でエラーになる', () => {
    const result = GetRepositoryResponseSchema.safeParse({ ...validRepository, url: 'not-a-url' })
    expect(result.success).toBe(false)
  })

  it('owner.avatarUrlが無効なURL形式でエラーになる', () => {
    const result = GetRepositoryResponseSchema.safeParse({
      ...validRepository,
      owner: { ...validRepository.owner, avatarUrl: 'not-a-url' },
    })
    expect(result.success).toBe(false)
  })

  it('idが小数（非int）でエラーになる', () => {
    const result = GetRepositoryResponseSchema.safeParse({ ...validRepository, id: 1.5 })
    expect(result.success).toBe(false)
  })
})

describe('SearchRepositoriesResponseSchema', () => {
  it('itemsに1件含む有効なレスポンスをパースできる', () => {
    const input = {
      totalCount: 1,
      incompleteResults: false,
      items: [validRepository],
    }
    expect(SearchRepositoriesResponseSchema.safeParse(input).success).toBe(true)
  })

  it('itemsが空配列でもパースできる', () => {
    const input = {
      totalCount: 0,
      incompleteResults: false,
      items: [],
    }
    expect(SearchRepositoriesResponseSchema.safeParse(input).success).toBe(true)
  })

  it('totalCountが小数（非int）でエラーになる', () => {
    const result = SearchRepositoriesResponseSchema.safeParse({
      totalCount: 1.5,
      incompleteResults: false,
      items: [],
    })
    expect(result.success).toBe(false)
  })

  it('incompleteResultsがboolean以外でエラーになる', () => {
    const result = SearchRepositoriesResponseSchema.safeParse({
      totalCount: 0,
      incompleteResults: 'false',
      items: [],
    })
    expect(result.success).toBe(false)
  })
})
