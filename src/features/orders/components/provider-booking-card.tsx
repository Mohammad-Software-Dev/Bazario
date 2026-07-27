import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { RecentProviderBooking } from '@/features/account/types/account.types'
import { useCompleteBookingMutation } from '@/features/orders/hooks/use-complete-booking-mutation'
import { useConfirmBookingMutation } from '@/features/orders/hooks/use-confirm-booking-mutation'
import { getApiErrorMessage } from '@/lib/api/api-error'
import { getLocalizedValue } from '@/lib/localized-value'

interface ProviderBookingCardProps {
  booking: RecentProviderBooking
}

function getServiceTitle(booking: RecentProviderBooking) {
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

  const isConfirming = confirmBookingMutation.isPending && confirmBookingMutation.variables === booking.id
  const isCompleting = completeBookingMutation.isPending && completeBookingMutation.variables === booking.id

  const mutationError =
    (confirmBookingMutation.variables === booking.id && confirmBookingMutation.isError
      ? confirmBookingMutation.error
      : null) ??
    (completeBookingMutation.variables === booking.id && completeBookingMutation.isError
      ? completeBookingMutation.error
      : null)

  return (
    <Card>
      <CardContent className="space-y-3 p-4 text-sm">
        <div>
          <p className="font-medium">{getServiceTitle(booking)}</p>
          <p className="text-muted-foreground">Customer: {booking.customer_user.name}</p>
        </div>

        <div className="space-y-1 text-muted-foreground">
          <p>Status: {booking.status}</p>
          <p>Starts: {new Date(booking.starts_at).toLocaleString()}</p>
          <p>Ends: {new Date(booking.ends_at).toLocaleString()}</p>
        </div>

        {mutationError ? (
          <p className="text-sm text-destructive">
            {getApiErrorMessage(mutationError, 'Unable to update this booking right now.')}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
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
      </CardContent>
    </Card>
  )
}
