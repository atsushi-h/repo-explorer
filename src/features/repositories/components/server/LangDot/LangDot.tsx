import githubColors from 'github-colors'

type Props = {
  lang: string
}

export function LangDot({ lang }: Props) {
  const color = githubColors.get(lang)?.color ?? '#888'
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span
        aria-hidden="true"
        className="size-[11px] flex-shrink-0 rounded-full"
        style={{ background: color, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.12)' }}
      />
      <span>{lang}</span>
    </span>
  )
}
