'use client'

import { useSearchParams } from 'next/navigation'

// ロゴのリンク先を組み立てる。検索中(q あり)は現在の検索 URL を指すことで、
// ロゴをクリックしても検索クエリ・結果・入力欄を失わないようにする。
export function usePageHeader() {
  const params = useSearchParams()
  const q = params.get('q') ?? ''

  let href = '/'
  if (q) {
    const sp = new URLSearchParams({ q })
    const page = params.get('page')
    if (page) sp.set('page', page)
    href = `/?${sp}`
  }

  return { href }
}
