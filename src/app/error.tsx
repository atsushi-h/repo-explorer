'use client'

import { BugIcon, HomeIcon, RefreshCwIcon, TriangleAlertIcon } from 'lucide-react'
import Link from 'next/link'
import { StateMessage } from '@/shared/components/feedback/StateMessage'
import { Button } from '@/shared/components/ui/button'

type Props = {
  error: Error & { digest?: string }
  unstable_retry: () => void
}

export default function ErrorPage({ error, unstable_retry }: Props) {
  return (
    <StateMessage
      icon={BugIcon}
      tone="error"
      title="予期しないエラーが発生しました"
      desc="申し訳ありません。問題が発生したため、ページを表示できませんでした。ページを再読み込みするか、しばらくしてからもう一度お試しください。"
      actions={
        <>
          <Button onClick={() => unstable_retry()}>
            <RefreshCwIcon /> 再読み込み
          </Button>
          <Link href="/">
            <Button variant="outline">
              <HomeIcon /> トップへ戻る
            </Button>
          </Link>
        </>
      }
      meta={
        error.digest ? (
          <>
            <TriangleAlertIcon size={13} /> Error digest: {error.digest}
          </>
        ) : undefined
      }
    />
  )
}
