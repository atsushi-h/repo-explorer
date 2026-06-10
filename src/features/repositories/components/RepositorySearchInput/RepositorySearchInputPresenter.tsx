import { SearchIcon } from 'lucide-react'
import type * as React from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'

type Props = {
  value: string
  onChange: (value: string) => void
  onSubmit: NonNullable<React.ComponentProps<'form'>['onSubmit']>
}

export function RepositorySearchInputPresenter({ value, onChange, onSubmit }: Props) {
  return (
    <form className="flex items-stretch gap-2.5" onSubmit={onSubmit}>
      <div className="relative flex-1">
        <SearchIcon
          size={17}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          aria-label="リポジトリを検索"
          className="h-10 pl-9"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="リポジトリ名を入力してください"
        />
      </div>
      <Button type="submit" className="h-10 px-4">
        検索
      </Button>
    </form>
  )
}
