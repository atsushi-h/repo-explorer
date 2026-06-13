import 'server-only'

import {
  type GetRepositoryRequest,
  GetRepositoryRequestSchema,
  type GetRepositoryResponse,
  type SearchRepositoriesRequest,
  SearchRepositoriesRequestSchema,
  type SearchRepositoriesResponse,
} from '@/external/dto/repositories.dto'
import {
  toGetRepositoryResponse,
  toSearchRepositoriesResponse,
} from '@/external/handler/repositories.converter'
import {
  getOpenIssuesCount,
  getRepository,
  searchRepositories,
} from '@/external/service/repositories.service'

export async function searchRepositoriesQuery(
  request: SearchRepositoriesRequest,
): Promise<SearchRepositoriesResponse> {
  const result = SearchRepositoriesRequestSchema.safeParse(request)
  if (!result.success) throw new Error('リクエストが不正です')

  const data = await searchRepositories({
    q: result.data.query,
    page: result.data.page,
    per_page: result.data.perPage,
  })
  return toSearchRepositoriesResponse(data)
}

export async function getRepositoryQuery(
  request: GetRepositoryRequest,
): Promise<GetRepositoryResponse> {
  const result = GetRepositoryRequestSchema.safeParse(request)
  if (!result.success) throw new Error('リクエストが不正です')

  const { owner, repo } = result.data
  // open_issues_count は PR を含むため、Issue のみの件数を Search API から取得して上書きする。
  // 並列実行しつつ、存在しないリポジトリ等の判定を保つため repo 側のエラーを優先して投げる
  // (素の Promise.all は最初に reject した方が surface し、404 が search の 422 に競り負けうる)。
  const [repoResult, issuesResult] = await Promise.allSettled([
    getRepository({ owner, repo }),
    getOpenIssuesCount({ owner, repo }),
  ])
  if (repoResult.status === 'rejected') throw repoResult.reason
  if (issuesResult.status === 'rejected') throw issuesResult.reason
  return toGetRepositoryResponse(repoResult.value, issuesResult.value)
}
