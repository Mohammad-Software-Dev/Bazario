import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { RecentProviderBooking } from '@/features/account/types/account.types'
import { useCompleteBookingMutation } from '@/features/orders/hooks/use-complete-booking-mutation'
import { useConfirmBookingMutation } from '@/features/orders/hooks/use-confirm-booking-mutation'
import type { CustomerBookingRecord } from '@/features/orders/types/order.types'
import { getApiErrorMessage } from '@/lib/api/api-error'
import { getLocalizedValue } from '@/lib/localized-value'

type ProviderBookingCardRecord = Pick<
  CustomerBookingRecord,
  'id' | 'status' | 'starts_at' | 'ends_at' | 'service' | 'customer_user'
> & {
  timezone?: string | null
}

interface ProviderBookingCardProps {
  booking: ProviderBookingCardRecord | RecentProviderBooking
}

function getServiceTitle(booking: ProviderBookingCardProps['booking']) {
  if (typeof booking.service.title === 'string') {
    return booking.service.title
  }

  return getLocalizedValue(booking.service.title) || 'Service'
}

function canConfirm(status: string) {
  return status === 'requested'
}

function canComplete(status: string) {
  return status === 'confirmed' || status === 'in_progress'
}

export function ProviderBookingCard({ booking }: ProviderBookingCardProps) {
  const confirmBookingMutation = useConfirmBookingMutation()
  const completeBookingMutation = useCompleteBookingMutation()

  const isConfirming =
    confirmBookingMutation.isPending && confirmBookingMutation.variables === booking.id
  const isCompleting =
    completeBookingMutation.isPending && completeBookingMutation.variables === booking.id

  const mutationError =
    (confirmBookingMutation.variables === booking.id && confirmBookingMutation.isError
      ? confirmBookingMutation.error
      : null) ??
    (completeBookingMutation.variables === booking.id && completeBookingMutation.isError
      ? completeBookingMutation.error
      : null)

  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="space-y-4 p-4 text-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-foreground">{getServiceTitle(booking)}</p>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize text-muted-foreground">
                {booking.status.replaceAll('_', ' ')}
              </span>
            </div>
            <p className="text-muted-foreground">Customer: {booking.customer_user?.name ?? 'Unknown customer'}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
              <span>Starts: {new Date(booking.starts_at).toLocaleString()}</span>
              <span>Ends: {new Date(booking.ends_at).toLocaleString()}</span>
              {'timezone' in booking && booking.timezone ? <span>Timezone: {booking.timezone}</span> : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 md:justify-end">
            {canConfirm(booking.status) ? (
              <Button
                variant="outline"
                onClick={() => confirmBookingMutation.mutate(booking.id)}
                disabled={isConfirming || isCompleting}
              >
                {isConfirming ? 'Confirming...' : 'Confirm booking'}
              </Button>
            ) : null}

            {canComplete(booking.status) ? (
              <Button
                variant="outline"
                onClick={() => completeBookingMutation.mutate(booking.id)}
                disabled={isConfirming || isCompleting}
              >
                {isCompleting ? 'Completing...' : 'Mark completed'}
              </Button>
            ) : null}
          </div>
        </div>

        {mutationError ? (
          <p className="text-sm text-destructive">
            {getApiErrorMessage(mutationError, 'Unable to update this booking right now.')}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
