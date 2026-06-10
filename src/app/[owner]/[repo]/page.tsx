import type { Metadata } from 'next'
import { getRepositoryQuery } from '@/external/handler/repositories.query.server'
import { RepositoriesDetailPage } from '@/features/repositories/RepositoriesDetailPage'

export async function generateMetadata({
  params,
}: PageProps<'/[owner]/[repo]'>): Promise<Metadata> {
  const { owner, repo } = await params
  try {
    const data = await getRepositoryQuery({ owner, repo })
    return {
      title: `${data.fullName} | GitHub リポジトリ検索`,
      description: data.description ?? undefined,
    }
  } catch {
    return {}
  }
}

export default async function Page(props: PageProps<'/[owner]/[repo]'>) {
  return <RepositoriesDetailPage params={props.params} />
}
