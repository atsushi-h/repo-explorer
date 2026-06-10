'use client'

import type { ListResult } from '@/features/repositories/types/repositoryList'
import { RepositoryListPresenter } from './RepositoryListPresenter'
import { useRepositoryList } from './useRepositoryList'

type Props = {
  result: ListResult
  query: string
}

export function RepositoryList({ result, query }: Props) {
  const { buildPageUrl, retry } = useRepositoryList(query)
  return <RepositoryListPresenter result={result} buildPageUrl={buildPageUrl} retry={retry} />
}
