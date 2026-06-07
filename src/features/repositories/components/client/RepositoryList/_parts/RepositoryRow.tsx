import { CircleDotIcon, GitForkIcon, StarIcon } from 'lucide-react'
import Link from 'next/link'
import type { SearchRepositoriesResponse } from '@/external/dto/repositories.dto'
import { Avatar } from '@/features/repositories/components/server/Avatar'
import { LangDot } from '@/features/repositories/components/server/LangDot'
import { Badge } from '@/shared/components/ui/badge'

type Repository = SearchRepositoriesResponse['items'][number]

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

function formatRelativeTime(dateStr: string | null): string | null {
  if (!dateStr) return null
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 60) return `${minutes} 分前`
  if (hours < 24) return `${hours} 時間前`
  if (days < 7) return `${days} 日前`
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

type Props = {
  repo: Repository
}

export function RepositoryRow({ repo }: Props) {
  const owner = repo.owner?.login ?? ''
  const updatedAt = formatRelativeTime(repo.updatedAt)

  return (
    <Link
      href={`/${owner}/${repo.name}`}
      className="flex items-start gap-3.5 rounded-[var(--radius)] border border-border bg-card p-4 transition-colors hover:border-ring/55 hover:shadow-sm"
    >
      <Avatar login={owner} avatarUrl={repo.owner?.avatarUrl} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="text-[15.5px] font-semibold tracking-tight">
          <span className="text-muted-foreground">{owner}/</span>
          <span>{repo.name}</span>
        </div>
        {repo.description && (
          <p className="line-clamp-2 text-[13.5px] leading-[1.55] text-muted-foreground">
            {repo.description}
          </p>
        )}
        {repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 4).map((t: string) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
          {repo.language && <LangDot lang={repo.language} />}
          <span className="inline-flex items-center gap-1">
            <StarIcon
              size={15}
              strokeWidth={1.8}
              aria-hidden="true"
              className="text-muted-foreground"
            />
            <span className="font-medium tabular-nums">
              <span className="sr-only">スター数: </span>
              {formatCount(repo.stargazersCount)}
            </span>
          </span>
          <span className="inline-flex items-center gap-1">
            <GitForkIcon
              size={15}
              strokeWidth={1.8}
              aria-hidden="true"
              className="text-muted-foreground"
            />
            <span className="font-medium tabular-nums">
              <span className="sr-only">フォーク数: </span>
              {formatCount(repo.forksCount)}
            </span>
          </span>
          <span className="inline-flex items-center gap-1">
            <CircleDotIcon
              size={15}
              strokeWidth={1.8}
              aria-hidden="true"
              className="text-muted-foreground"
            />
            <span className="font-medium tabular-nums">
              <span className="sr-only">オープンイシュー数: </span>
              {formatCount(repo.openIssuesCount)}
            </span>
          </span>
          {updatedAt && <span className="text-muted-foreground">{updatedAt}に更新</span>}
        </div>
      </div>
    </Link>
  )
}
