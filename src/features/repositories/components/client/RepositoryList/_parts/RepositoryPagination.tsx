import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination'

type Props = {
  page: number
  totalPages: number
  buildPageUrl: (page: number) => string
}

export function RepositoryPagination({ page, totalPages, buildPageUrl }: Props) {
  const pages: (number | '…')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }

  return (
    <Pagination className="pt-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildPageUrl(page - 1)}
            aria-disabled={page === 1}
            className={page === 1 ? 'pointer-events-none opacity-45' : ''}
            text="前へ"
          />
        </PaginationItem>
        {pages.map((p, i) =>
          p === '…' ? (
            <PaginationItem key={`ellipsis-after-${pages[i - 1] ?? 0}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink href={buildPageUrl(p)} isActive={p === page}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href={buildPageUrl(page + 1)}
            aria-disabled={page === totalPages}
            className={page === totalPages ? 'pointer-events-none opacity-45' : ''}
            text="次へ"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
