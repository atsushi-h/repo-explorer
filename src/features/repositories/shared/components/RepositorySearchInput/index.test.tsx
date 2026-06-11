// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RepositorySearchInput } from '.'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}))

function mockSearchParams(query: string) {
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams(query) as ReturnType<typeof useSearchParams>,
  )
}

function getInput() {
  return screen.getByRole<HTMLInputElement>('textbox', { name: 'リポジトリを検索' })
}

describe('RepositorySearchInput', () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as unknown as ReturnType<
      typeof useRouter
    >)
    mockSearchParams('')
  })

  // vitest の globals が無効なため testing-library の自動 cleanup が効かない
  afterEach(cleanup)

  it('URL の q が初期値として表示される', () => {
    mockSearchParams('q=react')
    render(<RepositorySearchInput />)
    expect(getInput().value).toBe('react')
  })

  it('入力すると値が更新される', () => {
    mockSearchParams('q=react')
    render(<RepositorySearchInput />)
    fireEvent.change(getInput(), { target: { value: 'vue' } })
    expect(getInput().value).toBe('vue')
  })

  it('URL の q が変わると入力値が URL と同期される(ブラウザバック相当)', () => {
    mockSearchParams('q=react')
    const { rerender } = render(<RepositorySearchInput />)
    fireEvent.change(getInput(), { target: { value: 'vue' } })

    mockSearchParams('q=typescript')
    rerender(<RepositorySearchInput />)
    expect(getInput().value).toBe('typescript')
  })

  it('URL の q が変わらない再レンダリングでは入力中の値が保持される(ページ送り相当)', () => {
    mockSearchParams('q=react&page=1')
    const { rerender } = render(<RepositorySearchInput />)
    fireEvent.change(getInput(), { target: { value: 'vue' } })

    mockSearchParams('q=react&page=2')
    rerender(<RepositorySearchInput />)
    expect(getInput().value).toBe('vue')
  })

  it('q なしの URL に変わると入力値が空になる(トップへ戻る相当)', () => {
    mockSearchParams('q=react')
    const { rerender } = render(<RepositorySearchInput />)

    mockSearchParams('')
    rerender(<RepositorySearchInput />)
    expect(getInput().value).toBe('')
  })
})
