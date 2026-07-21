import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getApiErrorMessage } from '@/lib/api/api-error'

import { formatBookingWindow, formatOrderMoney, getBookingPrimaryProviderName, getBookingServiceTitle, getLatestRefund } from '@/features/orders/lib/order-format'
import { useCancelBookingMutation } from '@/features/orders/hooks/use-cancel-booking-mutation'
import type { CustomerBookingRecord } from '@/features/orders/types/order.types'
import { OrderStatusBadge } from '@/features/orders/components/order-status-badge'

interface BookingListCardProps {
  booking: CustomerBookingRecord
}

export function BookingListCard({ booking }: BookingListCardProps) {
  const cancelBookingMutation = useCancelBookingMutation()
  const latestRefund = getLatestRefund(booking.order_item)
  const isFinalized = ['completed', 'cancelled_by_customer', 'cancelled_by_provider'].includes(booking.status)

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>{getBookingServiceTitle(booking.service)}</CardTitle>
          <p className="text-sm text-muted-foreground">{getBookingPrimaryProviderName(booking)}</p>
        </div>
        <OrderStatusBadge status={booking.status} />
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="space-y-1 text-muted-foreground">
          <p>{formatBookingWindow(booking.starts_at, booking.ends_at, booking.timezone)}</p>
          {booking.location_type ? <p>Location: {booking.location_type}</p> : null}
        </div>

        {latestRefund ? (
          <div className="rounded-lg border border-dashed p-3 text-muted-foreground">
            <p className="font-medium text-foreground">Refund</p>
            <p>Status: {latestRefund.status ?? 'Pending'}</p>
            <p>Amount: {formatOrderMoney(latestRefund.amount, latestRefund.currency_iso)}</p>
          </div>
        ) : null}

        {cancelBookingMutation.isError ? (
          <p className="text-sm text-destructive">
            {getApiErrorMessage(cancelBookingMutation.error, 'Unable to cancel this booking right now.')}
          </p>
        ) : null}

        <Button
          variant="outline"
          onClick={() => cancelBookingMutation.mutate({ bookingId: booking.id })}
          disabled={isFinalized || cancelBookingMutation.isPending}
        >
          {cancelBookingMutation.isPending ? 'Cancelling...' : 'Cancel booking'}
        </Button>
      </CardContent>
    </Card>
  )
}
