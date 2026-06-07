import 'server-only'

import { cache } from 'react'
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

// React の cache() はリクエストスコープのメモ化。同一リクエスト内（generateMetadata + Page）での重複呼び出しを排除する。
// キャッシュはレスポンス返却時に破棄されるため、リクエストをまたいで共有されない。
const cachedGetRepository = cache(
  async (owner: string, repo: string): Promise<GetRepositoryResponse> => {
    const repository = await getRepository({ owner, repo })
    return toGetRepositoryResponse(repository)
  },
)

export async function getRepositoryQuery(
  request: GetRepositoryRequest,
): Promise<GetRepositoryResponse> {
  const result = GetRepositoryRequestSchema.safeParse(request)
  if (!result.success) throw new Error('リクエストが不正です')

  return cachedGetRepository(result.data.owner, result.data.repo)
}
