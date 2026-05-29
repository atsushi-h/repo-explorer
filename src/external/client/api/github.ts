import type {
  GetRepositoryData,
  GetRepositoryParams,
  SearchRepositoriesData,
  SearchRepositoriesParams,
} from '@/external/client/api/type'

const GITHUB_API_BASE = 'https://api.github.com'

const GITHUB_HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2026-03-10',
} as const

type GitHubResponse<T> = { data: T; status: number }

async function githubFetch<T>(url: string): Promise<{ data: T; status: number }> {
  const response = await fetch(url, { headers: GITHUB_HEADERS })

  // response.json() は空ボディで SyntaxError を throw するため、
  // text() で取得してから手動で JSON.parse() する。
  // これにより 304 の空ボディを安全に扱いつつ、
  // パースエラー時にステータスコードを含むエラーメッセージを出せる。
  const body = response.status === 304 ? null : await response.text()

  let data: unknown
  try {
    data = body ? JSON.parse(body) : {}
  } catch {
    throw new Error(`${response.status} ${response.statusText}: invalid response body`)
  }

  return { data: data as T, status: response.status }
}

/**
 * リポジトリ検索
 * @see https://docs.github.com/ja/rest/search/search?apiVersion=2026-03-10#search-repositories
 */
export async function searchRepositories(
  params: SearchRepositoriesParams,
): Promise<GitHubResponse<SearchRepositoriesData>> {
  return githubFetch<SearchRepositoriesData>(
    `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(params.q)}&per_page=${params.per_page || 30}&page=${params.page || 1}`,
  )
}

/**
 * 単一リポジトリ取得
 * @see https://docs.github.com/ja/rest/repos/repos?apiVersion=2026-03-10#get-a-repository
 */
export async function getRepository(
  params: GetRepositoryParams,
): Promise<GitHubResponse<GetRepositoryData>> {
  return githubFetch<GetRepositoryData>(
    `${GITHUB_API_BASE}/repos/${encodeURIComponent(params.owner)}/${encodeURIComponent(params.repo)}`,
  )
}
