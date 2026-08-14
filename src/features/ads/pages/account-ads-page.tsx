import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PaginationControls } from '@/components/shared/pagination-controls'
import { MyAdCard } from '@/features/ads/components/my-ad-card'
import { useMyAdsQuery } from '@/features/ads/hooks/use-my-ads-query'
import { mapAdToViewModel } from '@/features/ads/lib/ad-mappers'
import { getApiErrorMessage } from '@/lib/api/api-error'

function parsePage(value: string | null) {
  const page = Number(value)

  if (!Number.isInteger(page) || page < 1) {
    return 1
  }

  return page
}

export function AccountAdsPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parsePage(searchParams.get('page'))
  const myAdsQuery = useMyAdsQuery(page)

  const result = myAdsQuery.data?.result
  const ads = result?.data ?? []

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
          <p className="text-sm text-muted-foreground">{t('ads.workspaceEyebrow')}</p>
          <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
            {t('ads.manageAds')}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{t('ads.manageAdsDescription')}</p>
        </div>
        <Button asChild>
          <Link to="/account/ads/new">{t('ads.createAd')}</Link>
        </Button>
      </section>

      {myAdsQuery.isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : null}

      {!myAdsQuery.isLoading && myAdsQuery.isError ? (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(myAdsQuery.error, t('ads.loadMineError'))}
          </CardContent>
        </Card>
      ) : null}

      {!myAdsQuery.isLoading && !myAdsQuery.isError ? (
        <section className="space-y-6">
          {ads.length ? (
            <div className="space-y-4">
              {ads.map((ad) => (
                <MyAdCard key={ad.id} ad={mapAdToViewModel(ad)} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-sm text-muted-foreground">
                {t('ads.noAdsYet')}
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
