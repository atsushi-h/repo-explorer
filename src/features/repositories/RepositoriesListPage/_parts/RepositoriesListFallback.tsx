import { Skeleton } from '@/shared/components/ui/skeleton'
import { RepositoryRowSkeleton } from './RepositoryRowSkeleton'

type Props = {
  count: number
}

export function RepositoriesListFallback({ count }: Props) {
  return (
    <div className="flex flex-col gap-[18px]">
      <div className="border-b pb-1">
        <Skeleton className="h-[13px] w-[140px]" />
      </div>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {Array.from({ length: count }, (_, i) => `row-${i}`).map((key) => (
          <RepositoryRowSkeleton key={key} />
        ))}
      </ul>
    </div>
  )
}
