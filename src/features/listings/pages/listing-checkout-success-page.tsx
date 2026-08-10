import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { reconcileListingCheckoutSession } from '@/features/listings/api/listings-api'
import { getApiErrorMessage } from '@/lib/api/api-error'

function parseListingId(value: string | null) {
  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

export function ListingCheckoutSuccessPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isPaid, setIsPaid] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const listingId = parseListingId(searchParams.get('listing_id'))
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!listingId || !sessionId) {
      setIsLoading(false)
      setErrorMessage(t('listings.invalidCheckoutReturn'))
      return
    }

    let isMounted = true

    async function run() {
      try {
        const safeListingId = listingId
        const safeSessionId = sessionId

        if (safeListingId === null || safeSessionId === null) {
          return
        }

        const result = await reconcileListingCheckoutSession(safeListingId, { session_id: safeSessionId })

        if (!isMounted) {
          return
        }

        setIsPaid(result.is_paid)
        queryClient.invalidateQueries({ queryKey: ['listings', 'mine'] })
        queryClient.invalidateQueries({ queryKey: ['home'] })
      } catch (error) {
        if (!isMounted) {
          return
        }

        setErrorMessage(getApiErrorMessage(error, t('listings.checkoutSuccessError')))
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void run()

    return () => {
      isMounted = false
    }
  }, [listingId, queryClient, sessionId, t])

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{t('listings.workspaceEyebrow')}</p>
        <h1 className="font-heading text-3xl font-semibold text-foreground">{t('listings.checkoutSuccessTitle')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isLoading
              ? t('listings.checkoutConfirming')
              : errorMessage
                ? t('listings.checkoutNeedsAttention')
                : isPaid
                  ? t('listings.checkoutPaidTitle')
                  : t('listings.checkoutPendingTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {errorMessage ? <p className="text-destructive">{errorMessage}</p> : null}
          {!errorMessage ? (
            <p className="text-muted-foreground">
              {isLoading
                ? t('listings.checkoutConfirmingDescription')
                : isPaid
                  ? t('listings.checkoutReviewDescription')
                  : t('listings.checkoutPendingDescription')}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/account/announcements">{t('listings.manageListings')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/account">{t('common.backToAccount')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
