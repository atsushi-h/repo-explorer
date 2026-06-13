import { describe, expect, it, vi } from 'vitest'
import * as githubApi from '@/external/client/api/github'
import type {
  GetRepositoryData,
  SearchIssuesData,
  SearchRepositoriesData,
} from '@/external/client/api/type'
import {
  getOpenIssuesCount,
  getRepository,
  searchRepositories,
} from '@/external/service/repositories.service'

vi.mock('@/external/client/api/github')

const mockRepositoryData = {
  id: 1296269,
  name: 'Hello-World',
  full_name: 'octocat/Hello-World',
  description: 'This your first repo!',
  html_url: 'https://github.com/octocat/Hello-World',
  owner: {
    login: 'octocat',
    avatar_url: 'https://github.com/images/error/octocat_happy.gif',
    html_url: 'https://github.com/octocat',
  },
} as unknown as GetRepositoryData

const mockSearchData = {
  total_count: 1,
  incomplete_results: false,
  items: [mockRepositoryData],
} as unknown as SearchRepositoriesData

describe('getRepository', () => {
  it('status 200 のとき、リポジトリデータを返す', async () => {
    vi.mocked(githubApi.getRepository).mockResolvedValue({ data: mockRepositoryData, status: 200 })

    const result = await getRepository({ owner: 'octocat', repo: 'Hello-World' })

    expect(result).toEqual(mockRepositoryData)
  })

  it('status 404 のとき、「リポジトリが見つかりませんでした」エラーをスローする', async () => {
    vi.mocked(githubApi.getRepository).mockResolvedValue({
      data: {} as GetRepositoryData,
      status: 404,
    })

    await expect(getRepository({ owner: 'octocat', repo: 'missing' })).rejects.toThrow(
      'リポジトリが見つかりませんでした',
    )
  })

  it('status 500 のとき、「リポジトリの取得に失敗しました」エラーをスローする', async () => {
    vi.mocked(githubApi.getRepository).mockResolvedValue({
      data: {} as GetRepositoryData,
      status: 500,
    })

    await expect(getRepository({ owner: 'octocat', repo: 'Hello-World' })).rejects.toThrow(
      'リポジトリの取得に失敗しました',
    )
  })
})

describe('searchRepositories', () => {
  it('status 200 のとき、検索結果を返す', async () => {
    vi.mocked(githubApi.searchRepositories).mockResolvedValue({
      data: mockSearchData,
      status: 200,
    })

    const result = await searchRepositories({ q: 'react' })

    expect(result).toEqual(mockSearchData)
  })

  it('status 500 のとき、「リポジトリ一覧の取得に失敗しました」エラーをスローする', async () => {
    vi.mocked(githubApi.searchRepositories).mockResolvedValue({
      data: {} as SearchRepositoriesData,
      status: 500,
    })

    await expect(searchRepositories({ q: 'react' })).rejects.toThrow(
      'リポジトリ一覧の取得に失敗しました',
    )
  })
})

describe('getOpenIssuesCount', () => {
  it('status 200 のとき、total_count を返す', async () => {
    vi.mocked(githubApi.searchIssues).mockResolvedValue({
      data: { total_count: 843 } as SearchIssuesData,
      status: 200,
    })

    const result = await getOpenIssuesCount({ owner: 'react', repo: 'react' })

    expect(result).toBe(843)
  })

  it('rateLimit ペイロードのとき、RateLimitError をスローする', async () => {
    vi.mocked(githubApi.searchIssues).mockResolvedValue({
      data: { rateLimit: true } as unknown as SearchIssuesData,
      status: 403,
    })
    vi.mocked(githubApi.isRateLimitPayload).mockReturnValue(true)

    await expect(getOpenIssuesCount({ owner: 'react', repo: 'react' })).rejects.toThrow(
      'APIのリクエスト上限に達しました',
    )

    vi.mocked(githubApi.isRateLimitPayload).mockReset()
  })

  it('status が 200 以外のとき、「Issue 数の取得に失敗しました」エラーをスローする', async () => {
    vi.mocked(githubApi.searchIssues).mockResolvedValue({
      data: {} as SearchIssuesData,
      status: 422,
    })

    await expect(getOpenIssuesCount({ owner: 'react', repo: 'react' })).rejects.toThrow(
      'Issue 数の取得に失敗しました',
    )
  })
})
