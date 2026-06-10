'use client'

import { RepositorySearchInputPresenter } from './RepositorySearchInputPresenter'
import { useRepositorySearchInput } from './useRepositorySearchInput'

export function RepositorySearchInput() {
  const props = useRepositorySearchInput()
  return <RepositorySearchInputPresenter {...props} />
}
