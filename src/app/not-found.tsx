import { HomeIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-6 py-12 text-center">
      <div className="mb-3.5 font-mono text-8xl font-bold leading-none tracking-tighter text-foreground/70">
        404
      </div>
      <h2 className="text-lg font-semibold tracking-tight">ページが見つかりません</h2>
      <p className="max-w-[42ch] text-pretty text-sm leading-relaxed text-muted-foreground">
        お探しのページは存在しないか、移動または削除された可能性があります。
      </p>
      <div className="mt-[18px] flex flex-wrap justify-center gap-2.5">
        <Link href="/">
          <Button>
            <HomeIcon /> トップへ戻る
          </Button>
        </Link>
      </div>
    </div>
  )
}
