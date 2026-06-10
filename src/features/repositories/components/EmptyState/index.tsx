import type * as React from 'react'

type Props = {
  icon: React.FC<{ size?: number; strokeWidth?: number }>
  tone?: 'muted' | 'error' | 'warning'
  title: string
  desc: string
  actions?: React.ReactNode
  meta?: React.ReactNode
}

export function EmptyState({ icon: Icon, tone = 'muted', title, desc, actions, meta }: Props) {
  const iconClass =
    tone === 'error'
      ? 'bg-destructive/12 text-destructive'
      : tone === 'warning'
        ? 'bg-[hsl(38_92%_50%/0.14)] text-[hsl(38_92%_50%)]'
        : 'bg-muted text-muted-foreground'

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-6 py-12 text-center">
      <div className={`mb-3.5 flex size-16 items-center justify-center rounded-2xl ${iconClass}`}>
        <Icon size={30} strokeWidth={1.7} aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="max-w-[42ch] text-pretty text-sm leading-relaxed text-muted-foreground">
        {desc}
      </p>
      {actions && <div className="mt-[18px] flex flex-wrap justify-center gap-2.5">{actions}</div>}
      {meta && (
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] text-muted-foreground tabular-nums">
          {meta}
        </div>
      )}
    </div>
  )
}
