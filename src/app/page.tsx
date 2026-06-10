import { RepositoriesListPageTemplate } from '@/features/repositories/RepositoriesListPageTemplate'

export default async function Page(props: PageProps<'/'>) {
  return <RepositoriesListPageTemplate searchParams={props.searchParams} />
}
