import { Card, CardContent } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-[18px] px-8 py-7">
      <div className="flex flex-col gap-[18px]">
        <div className="flex items-center gap-[18px]">
          <Skeleton className="size-[72px] shrink-0 rounded-full" />
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-[22px] w-[240px]" />
            <Skeleton className="h-[14px] w-[110px]" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[14px] w-[70%]" />
          <Skeleton className="h-[14px] w-[45%]" />
        </div>
        <div className="mt-1.5 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {(['star', 'watcher', 'fork', 'issue'] as const).map((stat) => (
            <Card key={stat}>
              <CardContent className="flex flex-col gap-[14px] pt-4">
                <Skeleton className="h-3 w-[60%]" />
                <Skeleton className="h-[26px] w-[45%]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
