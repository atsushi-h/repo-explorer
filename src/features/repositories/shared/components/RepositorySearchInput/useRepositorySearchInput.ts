'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type * as React from 'react'
import { useState } from 'react'

export function useRepositorySearchInput() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [value, setValue] = useState(searchParams.get('q') ?? '')

  const onSubmit: NonNullable<React.ComponentProps<'form'>['onSubmit']> = (e) => {
    e.preventDefault()

    // 空欄のまま送信しても何もしない
    if (!value.trim()) return

    const params = new URLSearchParams()
    params.set('q', value.trim())
    params.set('page', '1')
    router.push(`/?${params}`)
  }

  return { value, onChange: setValue, onSubmit }
}
