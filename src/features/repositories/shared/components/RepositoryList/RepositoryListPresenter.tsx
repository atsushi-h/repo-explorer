import { ClockIcon, CompassIcon, RefreshCwIcon, SearchXIcon, TriangleAlertIcon } from 'lucide-react'
import type { ListResult } from '@/features/repositories/shared/types/repositoryList'
import { StateMessage } from '@/shared/components/feedback/StateMessage'
import { Button } from '@/shared/components/ui/button'
import { RepositoryPagination } from './_parts/RepositoryPagination'
import { RepositoryRow } from './_parts/RepositoryRow'

type Props = {
  result: ListResult
  buildPageUrl: (page: number) => string
  retry: () => void
}

export function RepositoryListPresenter({ result, buildPageUrl, retry }: Props) {
  if (result.status === 'idle') {
    return (
      <StateMessage
        icon={CompassIcon}
        title="リポジトリを検索してみましょう"
        desc="キーワードを入力すると、GitHub 上の公開リポジトリを検索できます。リポジトリ名・説明・トピックが対象です。"
      />
    )
  }

  if (result.status === 'noResults') {
    return (
      <>
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-between border-b pb-1 text-[13.5px] text-muted-foreground"
        >
          <span>
            <b className="text-foreground tabular-nums">0</b> 件のリポジトリ
          </span>
        </div>
        <StateMessage
          icon={SearchXIcon}
          title="該当するリポジトリが見つかりません"
          desc={`「${result.query}」に一致する結果はありませんでした。`}
        />
      </>
    )
  }

  if (result.status === 'error') {
    return (
      <StateMessage
        icon={TriangleAlertIcon}
        tone="error"
        title="検索中に問題が発生しました"
        desc="リポジトリの取得に失敗しました。ネットワーク接続を確認して、もう一度お試しください。"
        actions={
          <Button onClick={retry}>
            <RefreshCwIcon />
            再試行
          </Button>
        }
      />
    )
  }

  if (result.status === 'rateLimit') {
    return (
      <StateMessage
        icon={ClockIcon}
        tone="warning"
        title="APIのリクエスト上限に達しました"
        desc="GitHub API のレート制限に達しました。しばらく待ってから、もう一度お試しください。"
        actions={
          <Button onClick={retry}>
            <RefreshCwIcon />
            再試行
          </Button>
        }
      />
    )
  }

  const { data, page, totalPages } = result
  return (
    <>
      <div
        role="status"
        aria-live="polite"
        className="flex items-center justify-between border-b pb-1 text-[13.5px] text-muted-foreground"
      >
        <span>
          <b className="text-foreground tabular-nums">{data.totalCount.toLocaleString('ja-JP')}</b>{' '}
          件のリポジトリ
        </span>
      </div>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {data.items.map((repo) => (
          <li key={repo.id}>
            <RepositoryRow repo={repo} />
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <RepositoryPagination page={page} totalPages={totalPages} buildPageUrl={buildPageUrl} />
      )}
    </>
  )
}
