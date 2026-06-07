// @vitest-environment jsdom
import { renderHook } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useRepositoryList } from './useRepositoryList'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

describe('useRepositoryList', () => {
  const mockRefresh = vi.fn()

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ refresh: mockRefresh } as unknown as ReturnType<
      typeof useRouter
    >)
    mockRefresh.mockClear()
  })

  describe('buildPageUrl', () => {
    it('query が空のとき、q パラメータなしで page のみ含む URL を返す', () => {
      const { result } = renderHook(() => useRepositoryList(''))
      expect(result.current.buildPageUrl(1)).toBe('/?page=1')
    })

    it('query があるとき、q と page を含む URL を返す', () => {
      const { result } = renderHook(() => useRepositoryList('react'))
      expect(result.current.buildPageUrl(1)).toBe('/?q=react&page=1')
    })

    it('異なる page 番号を渡すと page パラメータに反映される', () => {
      const { result } = renderHook(() => useRepositoryList('react'))
      expect(result.current.buildPageUrl(3)).toBe('/?q=react&page=3')
    })

    it('query にスペースを含む文字列を渡すと URLエンコードされる', () => {
      const { result } = renderHook(() => useRepositoryList('hello world'))
      expect(result.current.buildPageUrl(1)).toBe('/?q=hello+world&page=1')
    })
  })

  describe('retry', () => {
    it('retry() を呼ぶと router.refresh() が1回呼ばれる', () => {
      const { result } = renderHook(() => useRepositoryList('react'))
      result.current.retry()
      expect(mockRefresh).toHaveBeenCalledTimes(1)
    })
  })
})
