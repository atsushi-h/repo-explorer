'use server'

import type { SearchRepositoriesRequest } from '@/external/dto/repositories.dto'
import { searchRepositoriesQuery } from '@/external/handler/repositories.query.server'

export async function searchRepositoriesQueryAction(request: SearchRepositoriesRequest) {
  return searchRepositoriesQuery(request)
}
