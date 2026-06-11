import { Suspense } from 'react'
import { RepositoryList } from '@/features/repositories/shared/components/RepositoryList'
import { RepositorySearchInput } from '@/features/repositories/shared/components/RepositorySearchInput'
import { fetchRepositoryListResult } from './api'
import { RepositoriesListFallback } from './components/RepositoriesListFallback'
import { PER_PAGE } from './constants'

type Props = {
  searchParams: PageProps<'/'>['searchParams']
}

async function RepositoryListData({ query, page }: { query: string; page: number }) {
  const result = await fetchRepositoryListResult(query, page)
  return <RepositoryList result={result} query={query} />
}

// searchParams の await(ランタイム API アクセス)は Suspense 境界内で行う必要があるため、
// この層に閉じ込める(cacheComponents の制約)。
async function RepositoryListSection({ searchParams }: Props) {
  const { q, page: pageParam = '1' } = await searchParams
  const query = Array.isArray(q) ? q[0] : (q ?? '')
  const page = Math.max(1, Number(Array.isArray(pageParam) ? pageParam[0] : pageParam) || 1)

  return (
    <Suspense key={`${query}-${page}`} fallback={<RepositoriesListFallback count={PER_PAGE} />}>
      <RepositoryListData query={query} page={page} />
    </Suspense>
  )
}

export function RepositoriesListPage({ searchParams }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-[18px] px-8 py-7">
      <Suspense>
        <RepositorySearchInput />
      </Suspense>
      <Suspense fallback={<RepositoriesListFallback count={PER_PAGE} />}>
        <RepositoryListSection searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
