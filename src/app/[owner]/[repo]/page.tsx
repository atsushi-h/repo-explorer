import type { Metadata } from 'next'
import { RepositoriesDetailPage } from '@/features/repositories/RepositoriesDetailPage'
import { fetchRepositoryDetail } from '@/features/repositories/RepositoriesDetailPage/api'

export async function generateMetadata({
  params,
}: PageProps<'/[owner]/[repo]'>): Promise<Metadata> {
  const { owner, repo } = await params
  // ページ本体と同じキャッシュエントリを共有するため fetchRepositoryDetail を使う
  const { data } = await fetchRepositoryDetail(owner, repo)
  if (!data) return {}
  return {
    title: `${data.fullName} | GitHub リポジトリ検索`,
    description: data.description ?? undefined,
  }
}

export default async function Page(props: PageProps<'/[owner]/[repo]'>) {
  return <RepositoriesDetailPage params={props.params} />
}
