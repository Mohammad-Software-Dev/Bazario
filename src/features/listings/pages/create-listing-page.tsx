import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createListingCheckoutSession, getListingPricing } from '@/features/listings/api/listings-api'
import { ListingForm } from '@/features/listings/components/listing-form'
import { useCreateListingMutation } from '@/features/listings/hooks/use-create-listing-mutation'
import type { CreateListingPayload } from '@/features/listings/types/listing.types'
import { getApiErrorMessage } from '@/lib/api/api-error'
import { formatMoney } from '@/lib/i18n/format'

export function CreateListingPage() {
  const { t, i18n } = useTranslation()
  const [serverError, setServerError] = useState<string | null>(null)
  const createListingMutation = useCreateListingMutation()
  const listingPricingQuery = useQuery({
    queryKey: ['listings', 'pricing'],
    queryFn: getListingPricing,
  })

  async function handleSubmit(payload: CreateListingPayload) {
    setServerError(null)

    try {
      const created = await createListingMutation.mutateAsync(payload)
      const checkoutSession = await createListingCheckoutSession(created.result.id)
      window.location.href = checkoutSession.checkout_url
    } catch (error) {
      setServerError(getApiErrorMessage(error, t('listings.createError')))
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 md:py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{t('listings.workspaceEyebrow')}</p>
          <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
            {t('listings.create')}
          </h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/account/announcements">{t('common.backToAccount')}</Link>
        </Button>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle>{t('listings.formCardTitle')}</CardTitle>
          <CardDescription>{t('listings.formCardDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}
          {listingPricingQuery.data?.result ? (
            <p className="rounded-2xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
              {t('listings.paymentNotice', {
                price: formatMoney(
                  listingPricingQuery.data.result.total_price,
                  listingPricingQuery.data.result.currency_iso,
                  i18n.language,
                ),
                days: listingPricingQuery.data.result.duration_days,
              })}
            </p>
          ) : null}
          <ListingForm isSubmitting={createListingMutation.isPending} onSubmit={handleSubmit} />
          <p className="text-sm text-muted-foreground">{t('listings.pendingPaymentNotice')}</p>
        </CardContent>
      </Card>
    </div>
  )
}
