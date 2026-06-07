import Image from 'next/image'

type Props = {
  login: string
  avatarUrl?: string | null
  size?: number
}

export function Avatar({ login, avatarUrl, size = 40 }: Props) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={login}
        width={size}
        height={size}
        className="flex-shrink-0 rounded-full object-cover"
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={login}
      className="flex flex-shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {login[0]?.toUpperCase() ?? '?'}
    </div>
  )
}
