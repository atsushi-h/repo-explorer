import type { GetRepositoryResponse } from '@/external/dto/repositories.dto'
import { getRepositoryQuery } from '@/external/handler/repositories.query.server'
import { NotFoundError, RateLimitError } from '@/external/utils/errors'

export type DetailResult =
  | { data: GetRepositoryResponse; errorType: null }
  | { data: null; errorType: 'rateLimit' | 'error' | 'notFound' }

export async function fetchRepositoryDetail(owner: string, repo: string): Promise<DetailResult> {
  try {
    const data = await getRepositoryQuery({ owner, repo })
    return { data, errorType: null }
  } catch (e) {
    if (e instanceof NotFoundError) return { data: null, errorType: 'notFound' }
    if (e instanceof RateLimitError) return { data: null, errorType: 'rateLimit' }
    return { data: null, errorType: 'error' }
  }
}
