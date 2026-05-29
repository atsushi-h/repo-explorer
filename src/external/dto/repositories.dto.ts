import { z } from 'zod'

// Request schemas
export const SearchRepositoriesRequestSchema = z.object({
  query: z.string().min(1, 'Query must be at least 1 character long'),
  page: z.number().int().min(1).optional(),
  perPage: z.number().int().min(1).max(100).optional(),
})

export const GetRepositoryRequestSchema = z.object({
  owner: z.string().min(1, 'Owner must be at least 1 character long'),
  repo: z.string().min(1, 'Repo must be at least 1 character long'),
})

// Response schemas
const RepositorySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  fullName: z.string(),
  description: z.string().nullable(),
  url: z.url(),
  owner: z
    .object({
      login: z.string(),
      avatarUrl: z.url(),
      url: z.url(),
    })
    .nullable(),
})

export const SearchRepositoriesResponseSchema = z.object({
  totalCount: z.number().int(),
  incompleteResults: z.boolean(),
  items: z.array(RepositorySchema),
})

export const GetRepositoryResponseSchema = RepositorySchema

// Type exports
export type SearchRepositoriesRequest = z.infer<typeof SearchRepositoriesRequestSchema>
export type SearchRepositoriesResponse = z.infer<typeof SearchRepositoriesResponseSchema>
export type GetRepositoryRequest = z.infer<typeof GetRepositoryRequestSchema>
export type GetRepositoryResponse = z.infer<typeof GetRepositoryResponseSchema>
