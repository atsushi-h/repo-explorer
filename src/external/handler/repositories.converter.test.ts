import { describe, expect, test } from 'vitest'
import type { GetRepositoryData, SearchRepositoriesData } from '@/external/client/api/type'
import {
  toGetRepositoryResponse,
  toSearchRepositoriesResponse,
} from '@/external/handler/repositories.converter'

const mockOwner = {
  login: 'octocat',
  avatar_url: 'https://github.com/images/error/octocat_happy.gif',
  html_url: 'https://github.com/octocat',
} as GetRepositoryData['owner']

const mockGetRepositoryData = {
  id: 1296269,
  name: 'Hello-World',
  full_name: 'octocat/Hello-World',
  description: 'This your first repo!',
  html_url: 'https://github.com/octocat/Hello-World',
  owner: mockOwner,
} as unknown as GetRepositoryData

describe('toGetRepositoryResponse', () => {
  test('GitHub APIのレスポンスをDTOに変換する', () => {
    const result = toGetRepositoryResponse(mockGetRepositoryData)

    expect(result).toEqual({
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
    })
  })

  test('description が null の場合も変換できる', () => {
    const result = toGetRepositoryResponse({
      ...mockGetRepositoryData,
      description: null,
    })

    expect(result.description).toBeNull()
  })
})

describe('toSearchRepositoriesResponse', () => {
  test('GitHub API検索レスポンスをDTOに変換する', () => {
    const mockData = {
      total_count: 1,
      incomplete_results: false,
      items: [
        {
          id: 1296269,
          name: 'Hello-World',
          full_name: 'octocat/Hello-World',
          description: 'This your first repo!',
          html_url: 'https://github.com/octocat/Hello-World',
          owner: mockOwner,
        },
      ],
    } as unknown as SearchRepositoriesData

    const result = toSearchRepositoriesResponse(mockData)

    expect(result).toEqual({
      totalCount: 1,
      incompleteResults: false,
      items: [
        {
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
        },
      ],
    })
  })
})
