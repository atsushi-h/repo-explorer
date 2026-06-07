import { RepositoriesListPageTemplate } from '@/features/repositories/components/server/RepositoriesListPageTemplate'

export default async function Page(props: PageProps<'/'>) {
  return <RepositoriesListPageTemplate searchParams={props.searchParams} />
}
