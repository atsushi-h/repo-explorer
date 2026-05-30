import type { GetRepositoryData, SearchRepositoriesData } from '@/external/client/api/type'
import {
  type GetRepositoryResponse,
  GetRepositoryResponseSchema,
  type SearchRepositoriesResponse,
  SearchRepositoriesResponseSchema,
} from '@/external/dto/repositories.dto'

export function toGetRepositoryResponse(data: GetRepositoryData): GetRepositoryResponse {
  return GetRepositoryResponseSchema.parse({
    id: data.id,
    name: data.name,
    fullName: data.full_name,
    description: data.description,
    url: data.html_url,
    owner: {
      login: data.owner.login,
      avatarUrl: data.owner.avatar_url,
      url: data.owner.html_url,
    },
    language: data.language ?? null,
    stargazersCount: data.stargazers_count ?? 0,
    watchersCount: data.watchers_count ?? 0,
    forksCount: data.forks_count ?? 0,
    openIssuesCount: data.open_issues_count ?? 0,
    topics: data.topics ?? [],
    updatedAt: data.updated_at ?? null,
  })
}

export function toSearchRepositoriesResponse(
  data: SearchRepositoriesData,
): SearchRepositoriesResponse {
  return SearchRepositoriesResponseSchema.parse({
    totalCount: data.total_count,
    incompleteResults: data.incomplete_results,
    items: data.items.map((item) => ({
      id: item.id,
      name: item.name,
      fullName: item.full_name,
      description: item.description,
      url: item.html_url,
      owner: {
        login: item.owner?.login,
        avatarUrl: item.owner?.avatar_url,
        url: item.owner?.html_url,
      },
      language: item.language ?? null,
      stargazersCount: item.stargazers_count ?? 0,
      watchersCount: item.watchers_count ?? 0,
      forksCount: item.forks_count ?? 0,
      openIssuesCount: item.open_issues_count ?? 0,
      topics: item.topics ?? [],
      updatedAt: item.updated_at ?? null,
    })),
  })
}
