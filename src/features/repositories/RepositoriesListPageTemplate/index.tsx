import { Suspense } from 'react'
import { searchRepositoriesQuery } from '@/external/handler/repositories.query.server'
import { RateLimitError } from '@/external/utils/errors'
import { RepositoryList } from '@/features/repositories/components/RepositoryList'
import { RepositorySearchInput } from '@/features/repositories/components/RepositorySearchInput'
import type { ListResult } from '@/features/repositories/types/repositoryList'
import { RepositoriesListFallback } from './_parts/RepositoriesListFallback'

// 1ページあたりの表示件数
const PER_PAGE = 10
// GitHub Search API の仕様上、検索結果は最大1000件までしか取得できない
const GITHUB_SEARCH_MAX_RESULTS = 1000

type Props = {
  searchParams: PageProps<'/'>['searchParams']
}

async function RepositoryListData({ query, page }: { query: string; page: number }) {
  let result: ListResult = { status: 'idle' }
  if (query) {
    try {
      const data = await searchRepositoriesQuery({ query, page, perPage: PER_PAGE })
      if (data.totalCount === 0) {
        result = { status: 'noResults', query }
      } else {
        const totalPages = Math.min(
          100,
          Math.ceil(Math.min(data.totalCount, GITHUB_SEARCH_MAX_RESULTS) / PER_PAGE),
        )
        result = { status: 'success', data, page, totalPages }
      }
    } catch (e) {
      if (e instanceof RateLimitError) {
        result = { status: 'rateLimit' }
      } else {
        result = { status: 'error', message: e instanceof Error ? e.message : '' }
      }
    }
  }
  return <RepositoryList result={result} query={query} />
}

export async function RepositoriesListPageTemplate({ searchParams }: Props) {
  const { q, page: pageParam = '1' } = await searchParams
  const query = Array.isArray(q) ? q[0] : (q ?? '')
  const page = Math.max(1, Number(Array.isArray(pageParam) ? pageParam[0] : pageParam) || 1)

  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-[18px] px-8 py-7">
      <Suspense>
        <RepositorySearchInput />
      </Suspense>
      <Suspense key={`${query}-${page}`} fallback={<RepositoriesListFallback count={PER_PAGE} />}>
        <RepositoryListData query={query} page={page} />
      </Suspense>
    </div>
  )
}
