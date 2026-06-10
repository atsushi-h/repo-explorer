import { ArrowLeftIcon, ClockIcon, RefreshCwIcon, TriangleAlertIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { StateMessage } from '@/shared/components/feedback/StateMessage'
import { Button } from '@/shared/components/ui/button'
import { DetailContent } from './_parts/DetailContent'
import { fetchRepositoryDetail } from './api'

type Props = {
  params: PageProps<'/[owner]/[repo]'>['params']
}

export async function RepositoriesDetailPage({ params }: Props) {
  const { owner, repo } = await params
  const { data, errorType } = await fetchRepositoryDetail(owner, repo)

  if (errorType === 'notFound') notFound()

  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-[18px] px-8 py-7">
      {errorType === 'rateLimit' && (
        <StateMessage
          icon={ClockIcon}
          tone="warning"
          title="APIのリクエスト上限に達しました"
          desc="GitHub API のレート制限に達しました。しばらく待ってから、もう一度お試しください。"
          actions={
            <Link href={`/${owner}/${repo}`}>
              <Button>
                <RefreshCwIcon /> 再試行
              </Button>
            </Link>
          }
        />
      )}
      {errorType === 'error' && (
        <StateMessage
          icon={TriangleAlertIcon}
          tone="error"
          title="リポジトリを読み込めませんでした"
          desc="詳細情報の取得中に問題が発生しました。ネットワーク接続を確認して、もう一度お試しください。"
          actions={
            <>
              <Link href={`/${owner}/${repo}`}>
                <Button>
                  <RefreshCwIcon /> 再試行
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeftIcon /> トップへ戻る
                </Button>
              </Link>
            </>
          }
        />
      )}
      {data && <DetailContent data={data} />}
    </div>
  )
}
