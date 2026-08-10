import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { reconcileAdCheckoutSession } from '@/features/ads/api/ads-api'
import { getApiErrorMessage } from '@/lib/api/api-error'

function parseAdId(value: string | null) {
  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

export function AdCheckoutSuccessPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isPaid, setIsPaid] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const adId = parseAdId(searchParams.get('ad_id'))
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!adId || !sessionId) {
      setIsLoading(false)
      setErrorMessage(t('ads.invalidCheckoutReturn'))
      return
    }

    let isMounted = true

    async function run() {
      try {
        const result = await reconcileAdCheckoutSession(adId as number, { session_id: sessionId as string })

        if (!isMounted) {
          return
        }

        setIsPaid(result.is_paid)
        queryClient.invalidateQueries({ queryKey: ['ads', 'mine'] })
        queryClient.invalidateQueries({ queryKey: ['home'] })
      } catch (error) {
        if (!isMounted) {
          return
        }

        setErrorMessage(getApiErrorMessage(error, t('ads.checkoutSuccessError')))
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
  }, [adId, queryClient, sessionId, t])

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{t('ads.workspaceEyebrow')}</p>
        <h1 className="font-heading text-3xl font-semibold text-foreground">{t('ads.checkoutSuccessTitle')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isLoading
              ? t('ads.checkoutConfirming')
              : errorMessage
                ? t('ads.checkoutNeedsAttention')
                : isPaid
                  ? t('ads.checkoutPaidTitle')
                  : t('ads.checkoutPendingTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {errorMessage ? <p className="text-destructive">{errorMessage}</p> : null}
          {!errorMessage ? (
            <p className="text-muted-foreground">
              {isLoading
                ? t('ads.checkoutConfirmingDescription')
                : isPaid
                  ? t('ads.checkoutReviewDescription')
                  : t('ads.checkoutPendingDescription')}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/account/ads">{t('ads.manageAds')}</Link>
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
