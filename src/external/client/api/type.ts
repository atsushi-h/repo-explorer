import type { Endpoints } from '@octokit/types'

// リポジトリ検索
export type SearchRepositoriesParams = Endpoints['GET /search/repositories']['parameters']
export type SearchRepositoriesData = Endpoints['GET /search/repositories']['response']['data']

// 単一リポジトリ取得
export type GetRepositoryParams = Endpoints['GET /repos/{owner}/{repo}']['parameters']
export type GetRepositoryData = Endpoints['GET /repos/{owner}/{repo}']['response']['data']

// Issue 検索（Issue 数の正確な取得に使用。open_issues_count は PR を含むため）
export type SearchIssuesData = Endpoints['GET /search/issues']['response']['data']
