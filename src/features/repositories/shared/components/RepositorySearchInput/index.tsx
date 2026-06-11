'use client'

import { useSearchParams } from 'next/navigation'
import { RepositorySearchInputPresenter } from './RepositorySearchInputPresenter'
import { useRepositorySearchInput } from './useRepositorySearchInput'

// URL の q が変わったら key で再マウントし、入力値(ローカル state)を URL と同期する。
// タイピングやページ送り(page のみ変化)では q が変わらないため入力は保持される。
export function RepositorySearchInput() {
  const q = useSearchParams().get('q') ?? ''
  return <RepositorySearchInputForm key={q} />
}

function RepositorySearchInputForm() {
  const props = useRepositorySearchInput()
  return <RepositorySearchInputPresenter {...props} />
}
