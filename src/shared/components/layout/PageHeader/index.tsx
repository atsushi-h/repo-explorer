import { BookMarkedIcon } from 'lucide-react'
import Link from 'next/link'

export function PageHeader() {
  return (
    <header className="flex h-[60px] flex-shrink-0 items-center border-b bg-card px-6">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BookMarkedIcon size={17} strokeWidth={2.1} />
        </span>
        <span className="text-[15px] font-semibold tracking-tight">GitHub リポジトリ検索</span>
      </Link>
    </header>
  )
}
