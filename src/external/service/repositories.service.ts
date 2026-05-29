import {
  getRepository as githubGetRepository,
  searchRepositories as githubSearchRepositories,
} from '@/external/client/api/github'
import type {
  GetRepositoryData,
  GetRepositoryParams,
  SearchRepositoriesData,
  SearchRepositoriesParams,
} from '@/external/client/api/type'

export async function getRepository(params: GetRepositoryParams): Promise<GetRepositoryData> {
  const res = await githubGetRepository(params)
  if (res.status === 404) throw new Error('リポジトリが見つかりませんでした')
  if (res.status !== 200) throw new Error('リポジトリの取得に失敗しました')
  return res.data
}

export async function searchRepositories(
  params: SearchRepositoriesParams,
): Promise<SearchRepositoriesData> {
  const res = await githubSearchRepositories(params)
  if (res.status !== 200) throw new Error('リポジトリ一覧の取得に失敗しました')
  return res.data
}
