'use client'

import { PageHeaderPresenter } from './PageHeaderPresenter'
import { usePageHeader } from './usePageHeader'

export function PageHeader() {
  const { href } = usePageHeader()
  return <PageHeaderPresenter href={href} />
}
