import { cacheLife } from 'next/cache'
import { searchRepositoriesQuery } from '@/external/handler/repositories.query.server'
import { RateLimitError } from '@/external/utils/errors'
import type { ListResult } from '@/features/repositories/shared/types/repositoryList'
import { PER_PAGE } from '../constants'

const GITHUB_SEARCH_MAX_RESULTS = 1000

export async function fetchRepositoryListResult(query: string, page: number): Promise<ListResult> {
  if (!query) return { status: 'idle' }
  return fetchCachedRepositoryList(query, page)
}

// query / page がキャッシュキーになる。
// エラーを 'use cache' 境界の外へ throw すると RSC ストリーム経由で
// クラス識別(instanceof)が失われるため、try/catch は境界の内側に置く。
async function fetchCachedRepositoryList(query: string, page: number): Promise<ListResult> {
  'use cache'
  try {
    const data = await searchRepositoriesQuery({ query, page, perPage: PER_PAGE })
    cacheLife('minutes')
    if (data.totalCount === 0) return { status: 'noResults', query }
    const totalPages = Math.min(
      100,
      Math.ceil(Math.min(data.totalCount, GITHUB_SEARCH_MAX_RESULTS) / PER_PAGE),
    )
    return { status: 'success', data, page, totalPages }
  } catch (e) {
    cacheLife('seconds') // 失敗は短命キャッシュ(再試行をすぐ反映しつつ連打による API 再打撃を防ぐ)
    if (e instanceof RateLimitError) return { status: 'rateLimit' }
    return { status: 'error', message: e instanceof Error ? e.message : '' }
  }
}
