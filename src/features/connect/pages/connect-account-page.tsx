import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useConnectStatusQuery } from '@/features/connect/hooks/use-connect-status-query'
import { useStartConnectOnboardingMutation } from '@/features/connect/hooks/use-start-connect-onboarding-mutation'
import { getApiErrorMessage } from '@/lib/api/api-error'

function formatEligibleType(value: string | null | undefined) {
  if (!value) {
    return 'N/A'
  }

  return value.replace(/_/g, ' ')
}

function getActionLabel(connected: boolean, fullyReady: boolean) {
  if (!connected) {
    return 'Connect Stripe'
  }

  if (!fullyReady) {
    return 'Resume onboarding'
  }

  return 'Open Stripe setup'
}

export function ConnectAccountPage() {
  const connectStatusQuery = useConnectStatusQuery()
  const startConnectOnboardingMutation = useStartConnectOnboardingMutation()

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
          <CardContent className="py-6 text-sm text-muted-foreground">Loading Stripe account...</CardContent>
        </Card>
      </div>
    )
  }

  if (connectStatusQuery.isError) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(connectStatusQuery.error, 'Unable to load Stripe account status right now.')}
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
          <p className="text-sm text-muted-foreground">Account workspace</p>
          <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">Stripe account</h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/account">Back to account</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stripe Connect setup</CardTitle>
          <CardDescription>
            Stripe setup is required before the platform can transfer payouts. Payout readiness depends on your account status and the platform payout flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground">Eligible type</p>
              <p className="mt-1 font-medium capitalize text-foreground">{formatEligibleType(status.eligible_type)}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground">Connected</p>
              <p className="mt-1 font-medium text-foreground">{status.connected ? 'Yes' : 'No'}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground">Charges enabled</p>
              <p className="mt-1 font-medium text-foreground">{account?.charges_enabled ? 'Yes' : 'No'}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground">Payouts enabled</p>
              <p className="mt-1 font-medium text-foreground">{account?.payouts_enabled ? 'Yes' : 'No'}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground">Details submitted</p>
              <p className="mt-1 font-medium text-foreground">{account?.details_submitted ? 'Yes' : 'No'}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground">Onboarding completed</p>
              <p className="mt-1 font-medium text-foreground">{account?.onboarding_completed_at ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {account?.stripe_account_id ? (
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground">Connected Stripe account</p>
              <p className="mt-1 break-all font-medium text-foreground">{account.stripe_account_id}</p>
            </div>
          ) : null}

          {startConnectOnboardingMutation.isError ? (
            <p className="text-sm text-destructive">
              {getApiErrorMessage(
                startConnectOnboardingMutation.error,
                'Unable to start Stripe onboarding right now.',
              )}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            {shouldShowAction ? (
              <Button onClick={handleStartOnboarding} disabled={startConnectOnboardingMutation.isPending}>
                {startConnectOnboardingMutation.isPending
                  ? 'Opening Stripe...'
                  : getActionLabel(status.connected, isFullyReady)}
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link to="/account/earnings">View earnings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
