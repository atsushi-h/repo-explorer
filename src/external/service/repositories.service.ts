import {
  getRepository as githubGetRepository,
  searchRepositories as githubSearchRepositories,
  isRateLimitPayload,
} from '@/external/client/api/github'
import type {
  GetRepositoryData,
  GetRepositoryParams,
  SearchRepositoriesData,
  SearchRepositoriesParams,
} from '@/external/client/api/type'
import { NotFoundError, RateLimitError } from '@/external/utils/errors'

export async function getRepository(params: GetRepositoryParams): Promise<GetRepositoryData> {
  const res = await githubGetRepository(params)
  if (isRateLimitPayload(res.data)) throw new RateLimitError()
  if (res.status === 404) throw new NotFoundError()
  if (res.status !== 200) throw new Error('リポジトリの取得に失敗しました')
  return res.data
}

export async function searchRepositories(
  params: SearchRepositoriesParams,
): Promise<SearchRepositoriesData> {
  const res = await githubSearchRepositories(params)
  if (isRateLimitPayload(res.data)) throw new RateLimitError()
  if (res.status !== 200) throw new Error('リポジトリ一覧の取得に失敗しました')
  return res.data
}
