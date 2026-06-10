import { searchRepositoriesQuery } from '@/external/handler/repositories.query.server'
import { RateLimitError } from '@/external/utils/errors'
import type { ListResult } from '@/features/repositories/types/repositoryList'
import { PER_PAGE } from '../constants'

const GITHUB_SEARCH_MAX_RESULTS = 1000

export async function fetchRepositoryListResult(query: string, page: number): Promise<ListResult> {
  if (!query) return { status: 'idle' }
  try {
    const data = await searchRepositoriesQuery({ query, page, perPage: PER_PAGE })
    if (data.totalCount === 0) return { status: 'noResults', query }
    const totalPages = Math.min(
      100,
      Math.ceil(Math.min(data.totalCount, GITHUB_SEARCH_MAX_RESULTS) / PER_PAGE),
    )
    return { status: 'success', data, page, totalPages }
  } catch (e) {
    if (e instanceof RateLimitError) return { status: 'rateLimit' }
    return { status: 'error', message: e instanceof Error ? e.message : '' }
  }
}
