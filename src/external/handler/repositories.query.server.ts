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
import { getRepository, searchRepositories } from '@/external/service/repositories.service'

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

  const repository = await getRepository({ owner: result.data.owner, repo: result.data.repo })
  return toGetRepositoryResponse(repository)
}
