import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useMeQuery } from '@/features/account/hooks/use-me-query'
import { AdForm } from '@/features/ads/components/ad-form'
import { createAdCheckoutSession } from '@/features/ads/api/ads-api'
import { useAdPositionsQuery } from '@/features/ads/hooks/use-ad-positions-query'
import { useCreateAdMutation } from '@/features/ads/hooks/use-create-ad-mutation'
import type { CreateAdPayload } from '@/features/ads/types/ad.types'
import { useMyProductsQuery } from '@/features/products/hooks/use-my-products-query'
import { useMyServicesQuery } from '@/features/services/hooks/use-my-services-query'
import { getApiErrorMessage } from '@/lib/api/api-error'

export function CreateAdPage() {
  const { t } = useTranslation()
  const [serverError, setServerError] = useState<string | null>(null)

  const meQuery = useMeQuery()
  const adPositionsQuery = useAdPositionsQuery()
  const sellerProfile = meQuery.data?.result.user.seller_profile ?? null
  const serviceProviderProfile = meQuery.data?.result.user.service_provider_profile ?? null
  const shouldLoadProducts = Boolean(sellerProfile)
  const shouldLoadServices = Boolean(serviceProviderProfile)
  const myProductsQuery = useMyProductsQuery({
    page: 1,
    perPage: 100,
    enabled: shouldLoadProducts,
  })
  const myServicesQuery = useMyServicesQuery({
    page: 1,
    perPage: 100,
    enabled: shouldLoadServices,
  })
  const createAdMutation = useCreateAdMutation()

  const isSubmitting = createAdMutation.isPending
  const positions = useMemo(
    () =>
      (adPositionsQuery.data?.result ?? []).filter((position) =>
        ['golden_ad', 'silver_ad', 'normal_ad'].includes(position.name),
      ),
    [adPositionsQuery.data?.result],
  )
  const products = shouldLoadProducts ? (myProductsQuery.data?.result.data ?? []) : []
  const services = shouldLoadServices ? (myServicesQuery.data?.result.data ?? []) : []

  async function handleCreateAd(payload: CreateAdPayload) {
    setServerError(null)

    try {
      const created = await createAdMutation.mutateAsync(payload)
      const checkoutSession = await createAdCheckoutSession(created.result.id)
      window.location.href = checkoutSession.checkout_url
    } catch (error) {
      setServerError(getApiErrorMessage(error, t('ads.createError')))
    }
  }

  const isLoadingDependencies =
    adPositionsQuery.isLoading ||
    meQuery.isLoading ||
    (shouldLoadProducts && myProductsQuery.isLoading) ||
    (shouldLoadServices && myServicesQuery.isLoading)

  const hasDependencyError =
    adPositionsQuery.isError ||
    meQuery.isError ||
    (shouldLoadProducts && myProductsQuery.isError) ||
    (shouldLoadServices && myServicesQuery.isError)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 md:py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{t('ads.workspaceEyebrow')}</p>
          <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
            {t('ads.createAd')}
          </h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/account/ads">{t('common.backToAccount')}</Link>
        </Button>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardHeader className="gap-3">
          <CardTitle>{t('ads.promoteExisting')}</CardTitle>
          <CardDescription>{t('ads.promoteCardDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

          {isLoadingDependencies ? (
            <div className="space-y-3">
              <div className="h-10 animate-pulse rounded bg-muted" />
              <div className="h-10 animate-pulse rounded bg-muted" />
              <div className="h-32 animate-pulse rounded bg-muted" />
            </div>
          ) : null}

          {!isLoadingDependencies && hasDependencyError ? (
            <p className="text-sm text-destructive">{t('ads.loadFormDependenciesError')}</p>
          ) : null}

          {!isLoadingDependencies &&
          !hasDependencyError ? (
            <AdForm
              positions={positions}
              products={products}
              services={services}
              sellerProfile={sellerProfile}
              serviceProviderProfile={serviceProviderProfile}
              isSubmitting={isSubmitting}
              onSubmit={handleCreateAd}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
