import { Skeleton } from '@/shared/components/ui/skeleton'

export function RepositoryRowSkeleton() {
  return (
    <li>
      <div className="flex items-start gap-3.5 rounded-[var(--radius)] border border-border bg-card p-4">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-[15px] w-[38%]" />
          <Skeleton className="h-[13px] w-[85%]" />
          <Skeleton className="h-[13px] w-[60%]" />
          <div className="mt-0.5 flex gap-2">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </div>
      </div>
    </li>
  )
}
