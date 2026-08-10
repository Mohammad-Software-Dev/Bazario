import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PaginationControls } from '@/components/shared/pagination-controls'
import { MyListingCard } from '@/features/listings/components/my-listing-card'
import { useMyListingsQuery } from '@/features/listings/hooks/use-my-listings-query'
import { getApiErrorMessage } from '@/lib/api/api-error'

function parsePage(value: string | null) {
  const page = Number(value)

  return Number.isInteger(page) && page > 0 ? page : 1
}

export function AccountListingsPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parsePage(searchParams.get('page'))
  const myListingsQuery = useMyListingsQuery(page)
  const result = myListingsQuery.data?.result
  const listings = result?.data ?? []

  function handlePageChange(nextPage: number) {
    const nextParams = new URLSearchParams()

    if (nextPage > 1) {
      nextParams.set('page', String(nextPage))
    }

    setSearchParams(nextParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:py-12">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{t('listings.workspaceEyebrow')}</p>
          <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
            {t('listings.manageListings')}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{t('listings.manageListingsDescription')}</p>
        </div>
        <Button asChild>
          <Link to="/account/announcements/new">{t('listings.create')}</Link>
        </Button>
      </section>

      {myListingsQuery.isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      ) : null}

      {!myListingsQuery.isLoading && myListingsQuery.isError ? (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(myListingsQuery.error, t('listings.loadMineError'))}
          </CardContent>
        </Card>
      ) : null}

      {!myListingsQuery.isLoading && !myListingsQuery.isError ? (
        <section className="space-y-6">
          {listings.length ? (
            <div className="space-y-4">
              {listings.map((listing) => (
                <MyListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-sm text-muted-foreground">
                {t('listings.noListingsYet')}
              </CardContent>
            </Card>
          )}

          <PaginationControls
            currentPage={result?.current_page ?? 1}
            lastPage={result?.last_page ?? 1}
            onPageChange={handlePageChange}
          />
        </section>
      ) : null}
    </div>
  )
}
