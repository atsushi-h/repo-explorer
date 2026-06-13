// @vitest-environment jsdom
import { renderHook } from '@testing-library/react'
import { useSearchParams } from 'next/navigation'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePageHeader } from './usePageHeader'

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}))

function mockSearchParams(query: string) {
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams(query) as ReturnType<typeof useSearchParams>,
  )
}

describe('usePageHeader', () => {
  beforeEach(() => {
    mockSearchParams('')
  })

  it('q がないとき href は / を返す', () => {
    const { result } = renderHook(() => usePageHeader())
    expect(result.current.href).toBe('/')
  })

  it('q があるとき検索を維持する href を返す', () => {
    mockSearchParams('q=react')
    const { result } = renderHook(() => usePageHeader())
    expect(result.current.href).toBe('/?q=react')
  })

  it('q と page があるとき両方を維持する href を返す', () => {
    mockSearchParams('q=react&page=2')
    const { result } = renderHook(() => usePageHeader())
    expect(result.current.href).toBe('/?q=react&page=2')
  })
})
