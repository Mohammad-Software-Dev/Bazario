import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useConnectStatusQuery } from '@/features/connect/hooks/use-connect-status-query'
import { useStartConnectOnboardingMutation } from '@/features/connect/hooks/use-start-connect-onboarding-mutation'
import { getApiErrorMessage } from '@/lib/api/api-error'

function formatEligibleType(value: string | null | undefined, fallback: string) {
  if (!value) {
    return fallback
  }

  return value.replace(/_/g, ' ')
}

export function ConnectAccountPage() {
  const { t } = useTranslation()
  const connectStatusQuery = useConnectStatusQuery()
  const startConnectOnboardingMutation = useStartConnectOnboardingMutation()

  function getActionLabel(connected: boolean, fullyReady: boolean) {
    if (!connected) {
      return t('connect.connectStripe')
    }

    if (!fullyReady) {
      return t('connect.resumeOnboarding')
    }

    return t('connect.openSetup')
  }

  async function handleStartOnboarding() {
    try {
      const result = await startConnectOnboardingMutation.mutateAsync()
      window.location.assign(result.onboarding_url)
    } catch {
      // Error is rendered below through mutation state.
    }
  }

  if (connectStatusQuery.isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            {t('connect.loading')}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (connectStatusQuery.isError) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(connectStatusQuery.error, t('provider.loadConnectStatusError'))}
          </CardContent>
        </Card>
      </div>
    )
  }

  const status = connectStatusQuery.data

  if (!status) {
    return null
  }

  const account = status.account
  const isFullyReady = Boolean(account?.details_submitted && account?.payouts_enabled)
  const shouldShowAction = status.eligible

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 md:py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{t('connect.workspace')}</p>
          <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
            {t('connect.title')}
          </h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/account">{t('common.backToAccount')}</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('connect.setupTitle')}</CardTitle>
          <CardDescription>{t('connect.setupDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground">{t('connect.eligibleType')}</p>
              <p className="mt-1 font-medium capitalize text-foreground">
                {formatEligibleType(status.eligible_type, t('connect.notAvailable'))}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground">{t('connect.connected')}</p>
              <p className="mt-1 font-medium text-foreground">
                {status.connected ? t('common.yes') : t('common.no')}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground">{t('connect.chargesEnabled')}</p>
              <p className="mt-1 font-medium text-foreground">
                {account?.charges_enabled ? t('common.yes') : t('common.no')}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground">{t('connect.payoutsEnabled')}</p>
              <p className="mt-1 font-medium text-foreground">
                {account?.payouts_enabled ? t('common.yes') : t('common.no')}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground">{t('connect.detailsSubmitted')}</p>
              <p className="mt-1 font-medium text-foreground">
                {account?.details_submitted ? t('common.yes') : t('common.no')}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground">{t('connect.onboardingCompleted')}</p>
              <p className="mt-1 font-medium text-foreground">
                {account?.onboarding_completed_at ? t('common.yes') : t('common.no')}
              </p>
            </div>
          </div>

          {account?.stripe_account_id ? (
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground">{t('connect.connectedAccount')}</p>
              <p className="mt-1 break-all font-medium text-foreground">{account.stripe_account_id}</p>
            </div>
          ) : null}

          {startConnectOnboardingMutation.isError ? (
            <p className="text-sm text-destructive">
              {getApiErrorMessage(startConnectOnboardingMutation.error, t('connect.startError'))}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            {shouldShowAction ? (
              <Button onClick={handleStartOnboarding} disabled={startConnectOnboardingMutation.isPending}>
                {startConnectOnboardingMutation.isPending
                  ? t('connect.opening')
                  : getActionLabel(status.connected, isFullyReady)}
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link to="/account/earnings">{t('connect.viewEarnings')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
