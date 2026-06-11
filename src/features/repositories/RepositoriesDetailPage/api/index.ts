import { cacheLife } from 'next/cache'
import type { GetRepositoryResponse } from '@/external/dto/repositories.dto'
import { getRepositoryQuery } from '@/external/handler/repositories.query.server'
import { NotFoundError, RateLimitError } from '@/external/utils/errors'

export type DetailResult =
  | { data: GetRepositoryResponse; errorType: null }
  | { data: null; errorType: 'rateLimit' | 'error' | 'notFound' }

// owner / repo がキャッシュキーになる。
// エラーを 'use cache' 境界の外へ throw すると RSC ストリーム経由で
// クラス識別(instanceof)が失われるため、try/catch は境界の内側に置く。
export async function fetchRepositoryDetail(owner: string, repo: string): Promise<DetailResult> {
  'use cache'
  try {
    const data = await getRepositoryQuery({ owner, repo })
    cacheLife('minutes')
    return { data, errorType: null }
  } catch (e) {
    if (e instanceof NotFoundError) {
      cacheLife('minutes')
      return { data: null, errorType: 'notFound' }
    }
    cacheLife('seconds') // 一時的な失敗は短命キャッシュ
    if (e instanceof RateLimitError) return { data: null, errorType: 'rateLimit' }
    return { data: null, errorType: 'error' }
  }
}
