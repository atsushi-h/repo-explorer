import type { Endpoints } from '@octokit/types'

// リポジトリ検索
export type SearchRepositoriesParams = Endpoints['GET /search/repositories']['parameters']
export type SearchRepositoriesData = Endpoints['GET /search/repositories']['response']['data']

// 単一リポジトリ取得
export type GetRepositoryParams = Endpoints['GET /repos/{owner}/{repo}']['parameters']
export type GetRepositoryData = Endpoints['GET /repos/{owner}/{repo}']['response']['data']
