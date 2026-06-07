'use client'

import { useRouter } from 'next/navigation'

export function useRepositoryList(query: string) {
  const router = useRouter()

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    params.set('page', String(page))
    return `/?${params}`
  }

  const retry = () => {
    router.refresh()
  }

  return { buildPageUrl, retry }
}
