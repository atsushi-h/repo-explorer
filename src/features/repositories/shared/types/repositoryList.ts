import type { SearchRepositoriesResponse } from '@/external/dto/repositories.dto'

export type ListResult =
  | { status: 'idle' }
  | { status: 'success'; data: SearchRepositoriesResponse; page: number; totalPages: number }
  | { status: 'noResults'; query: string }
  | { status: 'error'; message: string }
  | { status: 'rateLimit' }
