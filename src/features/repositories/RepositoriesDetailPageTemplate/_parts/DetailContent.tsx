import { CircleDotIcon, EyeIcon, GitForkIcon, StarIcon } from 'lucide-react'
import type { GetRepositoryResponse } from '@/external/dto/repositories.dto'
import { LangDot } from '@/features/repositories/components/LangDot'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Avatar } from '@/shared/components/user/Avatar'

type Props = {
  data: GetRepositoryResponse
}

export function DetailContent({ data }: Props) {
  const owner = data.owner?.login ?? ''
  const stats = [
    { icon: StarIcon, label: 'Star 数', value: data.stargazersCount },
    { icon: EyeIcon, label: 'Watcher 数', value: data.watchersCount },
    { icon: GitForkIcon, label: 'Fork 数', value: data.forksCount },
    { icon: CircleDotIcon, label: 'Issue 数', value: data.openIssuesCount },
  ]

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="flex items-center gap-[18px]">
        <Avatar login={owner} avatarUrl={data.owner?.avatarUrl} size={72} />
        <div>
          <div className="text-2xl font-semibold tracking-tight">
            <span className="text-muted-foreground font-medium">{owner} /</span>{' '}
            <span>{data.name}</span>
          </div>
          {data.language && (
            <div className="mt-2">
              <LangDot lang={data.language} />
            </div>
          )}
        </div>
      </div>
      {data.description && (
        <p className="text-[15px] leading-[1.6] text-muted-foreground max-w-[60ch]">
          {data.description}
        </p>
      )}
      {data.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.topics.map((t: string) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>
      )}
      <div className="mt-1.5 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex flex-col gap-2.5 pt-4">
              <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                <s.icon size={15} className="text-muted-foreground" />
                {s.label}
              </div>
              <div className="text-3xl font-semibold tracking-tight tabular-nums">
                {s.value.toLocaleString('ja-JP')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
