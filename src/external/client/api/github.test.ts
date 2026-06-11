import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getRepository, isRateLimitPayload, searchRepositories } from '@/external/client/api/github'

// github.ts が参照するのは status / statusText / headers.get() / text() のみ。
// Response コンストラクタの null ボディ制約(304 など)を避けるため最小スタブで代用する。
function mockResponse(init: {
  status?: number
  statusText?: string
  body?: string
  headers?: Record<string, string>
  text?: () => Promise<string>
}): Response {
  return {
    status: init.status ?? 200,
    statusText: init.statusText ?? '',
    headers: new Headers(init.headers ?? {}),
    text: init.text ?? (() => Promise.resolve(init.body ?? '')),
  } as Response
}

const fetchMock = vi.fn()

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
  fetchMock.mockReset()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const searchBody = {
  total_count: 1,
  incomplete_results: false,
  items: [{ id: 1, name: 'Hello-World', full_name: 'octocat/Hello-World' }],
}

describe('searchRepositories', () => {
  it('200 + 正常 JSON のとき data と status を返す', async () => {
    fetchMock.mockResolvedValue(mockResponse({ status: 200, body: JSON.stringify(searchBody) }))

    const result = await searchRepositories({ q: 'react' })

    expect(result).toEqual({ data: searchBody, status: 200 })
  })

  it('q がエンコードされ、per_page / page 未指定時は API デフォルト(30 / 1)で fetch する', async () => {
    fetchMock.mockResolvedValue(mockResponse({ body: JSON.stringify(searchBody) }))

    await searchRepositories({ q: 'hello world' })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/search/repositories?q=hello%20world&per_page=30&page=1',
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2026-03-10',
        },
      },
    )
  })

  it('per_page / page 指定時はその値で fetch する', async () => {
    fetchMock.mockResolvedValue(mockResponse({ body: JSON.stringify(searchBody) }))

    await searchRepositories({ q: 'react', per_page: 10, page: 3 })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/search/repositories?q=react&per_page=10&page=3',
      expect.anything(),
    )
  })

  it('403 + x-ratelimit-remaining が 0 のとき rateLimit ペイロードを返す', async () => {
    fetchMock.mockResolvedValue(
      mockResponse({
        status: 403,
        body: JSON.stringify({ message: 'API rate limit exceeded' }),
        headers: { 'x-ratelimit-remaining': '0' },
      }),
    )

    const result = await searchRepositories({ q: 'react' })

    expect(isRateLimitPayload(result.data)).toBe(true)
    expect(result.status).toBe(403)
  })

  it('403 + retry-after のとき rateLimit ペイロードを返す(セカンダリレート制限)', async () => {
    fetchMock.mockResolvedValue(
      mockResponse({
        status: 403,
        body: JSON.stringify({ message: 'You have exceeded a secondary rate limit' }),
        headers: { 'retry-after': '60' },
      }),
    )

    const result = await searchRepositories({ q: 'react' })

    expect(isRateLimitPayload(result.data)).toBe(true)
  })

  it('403 でもレート制限ヘッダーがないときは rateLimit 扱いせずボディを返す(権限エラーとの区別)', async () => {
    const forbiddenBody = { message: 'Forbidden' }
    fetchMock.mockResolvedValue(
      mockResponse({
        status: 403,
        body: JSON.stringify(forbiddenBody),
        headers: { 'x-ratelimit-remaining': '42' },
      }),
    )

    const result = await searchRepositories({ q: 'react' })

    expect(isRateLimitPayload(result.data)).toBe(false)
    expect(result).toEqual({ data: forbiddenBody, status: 403 })
  })

  it('429 + retry-after のとき rateLimit ペイロードを返す', async () => {
    fetchMock.mockResolvedValue(
      mockResponse({
        status: 429,
        body: JSON.stringify({ message: 'Too Many Requests' }),
        headers: { 'retry-after': '60' },
      }),
    )

    const result = await searchRepositories({ q: 'react' })

    expect(isRateLimitPayload(result.data)).toBe(true)
    expect(result.status).toBe(429)
  })

  it('422(validation failed / spammed)のとき rateLimit 扱いせずエラーボディを返す', async () => {
    const errorBody = {
      message: 'Validation Failed',
      errors: [{ resource: 'Search', field: 'q', code: 'missing' }],
    }
    fetchMock.mockResolvedValue(mockResponse({ status: 422, body: JSON.stringify(errorBody) }))

    const result = await searchRepositories({ q: 'react' })

    expect(isRateLimitPayload(result.data)).toBe(false)
    expect(result).toEqual({ data: errorBody, status: 422 })
  })

  it('200 + 空ボディのとき data が {} になる', async () => {
    fetchMock.mockResolvedValue(mockResponse({ status: 200, body: '' }))

    const result = await searchRepositories({ q: 'react' })

    expect(result).toEqual({ data: {}, status: 200 })
  })

  it('304 のとき text() を呼ばずに data が {} になる', async () => {
    const text = vi.fn()
    fetchMock.mockResolvedValue(mockResponse({ status: 304, text }))

    const result = await searchRepositories({ q: 'react' })

    expect(result).toEqual({ data: {}, status: 304 })
    expect(text).not.toHaveBeenCalled()
  })

  it('ボディが不正 JSON のとき status を含むメッセージで throw する', async () => {
    fetchMock.mockResolvedValue(
      mockResponse({ status: 502, statusText: 'Bad Gateway', body: '<html>error</html>' }),
    )

    await expect(searchRepositories({ q: 'react' })).rejects.toThrow(
      '502 Bad Gateway: invalid response body',
    )
  })
})

describe('getRepository', () => {
  const repoBody = { id: 1296269, name: 'Hello-World', full_name: 'octocat/Hello-World' }

  it('200 + 正常 JSON のとき data と status を返す', async () => {
    fetchMock.mockResolvedValue(mockResponse({ status: 200, body: JSON.stringify(repoBody) }))

    const result = await getRepository({ owner: 'octocat', repo: 'Hello-World' })

    expect(result).toEqual({ data: repoBody, status: 200 })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/repos/octocat/Hello-World',
      expect.anything(),
    )
  })

  it('owner / repo がエンコードされて URL に入る(パス区切り等を注入できない)', async () => {
    fetchMock.mockResolvedValue(mockResponse({ body: JSON.stringify(repoBody) }))

    await getRepository({ owner: 'octo/cat', repo: 'hello?world' })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/repos/octo%2Fcat/hello%3Fworld',
      expect.anything(),
    )
  })

  it('404 のとき throw せずエラーボディと status を返す(throw への変換は service 層の責務)', async () => {
    const notFoundBody = { message: 'Not Found' }
    fetchMock.mockResolvedValue(mockResponse({ status: 404, body: JSON.stringify(notFoundBody) }))

    const result = await getRepository({ owner: 'octocat', repo: 'missing' })

    expect(result).toEqual({ data: notFoundBody, status: 404 })
  })
})
