'use client'

import { RepositorySearchInputPresenter } from './RepositorySearchInputPresenter'
import { useRepositorySearchInput } from './useRepositorySearchInput'

export function RepositorySearchInputContainer() {
  const props = useRepositorySearchInput()
  return <RepositorySearchInputPresenter {...props} />
}
