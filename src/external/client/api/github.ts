import type {
  GetRepositoryData,
  GetRepositoryParams,
  SearchIssuesData,
  SearchRepositoriesData,
  SearchRepositoriesParams,
} from '@/external/client/api/type'

const GITHUB_API_BASE = 'https://api.github.com'

const GITHUB_HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2026-03-10',
} as const

type GitHubResponse<T> = { data: T; status: number }

type RateLimitPayload = { rateLimit: true }

export function isRateLimitPayload(data: unknown): data is RateLimitPayload {
  return typeof data === 'object' && data !== null && 'rateLimit' in data
}

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

  // 403 / 429 はどちらもレート制限の可能性あり。
  // プライマリ: x-ratelimit-remaining が 0、セカンダリ: retry-after ヘッダーあり。
  if (response.status === 403 || response.status === 429) {
    const retryAfter = response.headers.get('retry-after')
    const remaining = response.headers.get('x-ratelimit-remaining')

    if (retryAfter !== null || remaining === '0') {
      return { data: { rateLimit: true } as unknown as T, status: response.status }
    }
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

/**
 * Issue 検索
 * リポジトリ情報の open_issues_count は Open Issue と Open PR の合算のため、
 * PR を除いた Issue のみの件数を total_count から得る目的で使う。per_page=1 は
 * 本体に件数だけがあればよくレスポンスを最小化するため。
 * @see https://docs.github.com/ja/rest/search/search?apiVersion=2026-03-10#search-issues-and-pull-requests
 */
export async function searchIssues(params: {
  q: string
}): Promise<GitHubResponse<SearchIssuesData>> {
  return githubFetch<SearchIssuesData>(
    `${GITHUB_API_BASE}/search/issues?q=${encodeURIComponent(params.q)}&per_page=1`,
  )
}
