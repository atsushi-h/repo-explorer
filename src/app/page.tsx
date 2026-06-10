import { RepositoriesListPage } from '@/features/repositories/RepositoriesListPage'

export default async function Page(props: PageProps<'/'>) {
  return <RepositoriesListPage searchParams={props.searchParams} />
}
