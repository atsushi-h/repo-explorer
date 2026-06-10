// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'
import type * as React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useRepositorySearchInput } from './useRepositorySearchInput'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}))

describe('useRepositorySearchInput', () => {
  const mockPush = vi.fn()

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as unknown as ReturnType<
      typeof useRouter
    >)
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as ReturnType<typeof useSearchParams>,
    )
    mockPush.mockClear()
  })

  describe('初期値', () => {
    it('searchParams に q=react があるとき、value が react で初期化される', () => {
      vi.mocked(useSearchParams).mockReturnValue(
        new URLSearchParams('q=react') as ReturnType<typeof useSearchParams>,
      )
      const { result } = renderHook(() => useRepositorySearchInput())
      expect(result.current.value).toBe('react')
    })

    it('searchParams に q がないとき、value が空文字で初期化される', () => {
      const { result } = renderHook(() => useRepositorySearchInput())
      expect(result.current.value).toBe('')
    })
  })

  describe('onSubmit', () => {
    const createSubmitEvent = () => {
      const preventDefault = vi.fn()
      return {
        e: { preventDefault } as unknown as React.SubmitEvent<HTMLFormElement>,
        preventDefault,
      }
    }

    it('常に e.preventDefault() を呼ぶ', () => {
      const { result } = renderHook(() => useRepositorySearchInput())
      const { e, preventDefault } = createSubmitEvent()
      act(() => {
        result.current.onSubmit(e)
      })
      expect(preventDefault).toHaveBeenCalled()
    })

    it('value が空文字のとき router.push を呼ばない', () => {
      const { result } = renderHook(() => useRepositorySearchInput())
      const { e } = createSubmitEvent()
      act(() => {
        result.current.onSubmit(e)
      })
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('value がスペースのみのとき router.push を呼ばない', () => {
      const { result } = renderHook(() => useRepositorySearchInput())
      act(() => {
        result.current.onChange('   ')
      })
      const { e } = createSubmitEvent()
      act(() => {
        result.current.onSubmit(e)
      })
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('value が react のとき /?q=react&page=1 に push する', () => {
      const { result } = renderHook(() => useRepositorySearchInput())
      act(() => {
        result.current.onChange('react')
      })
      const { e } = createSubmitEvent()
      act(() => {
        result.current.onSubmit(e)
      })
      expect(mockPush).toHaveBeenCalledWith('/?q=react&page=1')
    })

    it('value に前後スペースがある場合、trim した値で push する', () => {
      const { result } = renderHook(() => useRepositorySearchInput())
      act(() => {
        result.current.onChange('  next.js  ')
      })
      const { e } = createSubmitEvent()
      act(() => {
        result.current.onSubmit(e)
      })
      expect(mockPush).toHaveBeenCalledWith('/?q=next.js&page=1')
    })
  })

  describe('onChange', () => {
    it('onChange を呼ぶと value が更新される', () => {
      const { result } = renderHook(() => useRepositorySearchInput())
      act(() => {
        result.current.onChange('typescript')
      })
      expect(result.current.value).toBe('typescript')
    })
  })
})
