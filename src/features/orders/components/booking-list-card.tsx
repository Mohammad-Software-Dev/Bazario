import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CancelBookingDialog } from '@/features/orders/components/cancel-booking-dialog'
import { OrderStatusBadge } from '@/features/orders/components/order-status-badge'
import {
  formatBookingCutoff,
  formatBookingWindow,
  formatOrderMoney,
  getBookingPrimaryProviderName,
  getBookingServiceTitle,
} from '@/features/orders/lib/order-format'
import type { CustomerBookingRecord } from '@/features/orders/types/order.types'

interface BookingListCardProps {
  booking: CustomerBookingRecord
}

export function BookingListCard({ booking }: BookingListCardProps) {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const cancelDeadline = formatBookingCutoff(booking.cutoffs.cancel_deadline, booking.timezone)
  const rescheduleDeadline = formatBookingCutoff(booking.cutoffs.reschedule_deadline, booking.timezone)
  const refundSummary = booking.refund_summary.applied ? booking.refund_summary : null
  const shouldShowRescheduleAction =
    booking.actions.can_reschedule || Boolean(booking.actions.reschedule_block_reason)
  const shouldShowCancelAction =
    booking.actions.can_cancel || Boolean(booking.actions.cancel_block_reason)
  const cancelSummary = booking.actions.can_cancel
    ? cancelDeadline
      ? `Available until ${cancelDeadline}`
      : 'Available until the service starts.'
    : booking.actions.cancel_block_reason ?? 'Cancellation is not available.'
  const rescheduleSummary = booking.actions.can_reschedule
    ? rescheduleDeadline
      ? `Available until ${rescheduleDeadline}`
      : 'Available until the service starts.'
    : booking.actions.reschedule_block_reason ?? 'Rescheduling is not available.'

  return (
    <>
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
            <p>Timezone: {booking.timezone ?? 'UTC'}</p>
            {booking.location_type ? <p>Location: {booking.location_type}</p> : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Cancellation</p>
              <p className="mt-1 text-sm text-foreground">{cancelSummary}</p>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Rescheduling</p>
              <p className="mt-1 text-sm text-foreground">{rescheduleSummary}</p>
            </div>
          </div>

          {refundSummary ? (
            <div className="rounded-lg border border-dashed p-3 text-muted-foreground">
              <p className="font-medium text-foreground">Refund</p>
              <p>Status: {refundSummary.status ?? 'Pending'}</p>
              {refundSummary.amount !== null && refundSummary.currency_iso ? (
                <p>Amount: {formatOrderMoney(refundSummary.amount, refundSummary.currency_iso)}</p>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            {shouldShowRescheduleAction ? (
              booking.actions.can_reschedule ? (
                <Button asChild variant="outline">
                  <Link to={`/account/bookings/${booking.id}/reschedule`}>Reschedule</Link>
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  Reschedule
                </Button>
              )
            ) : null}

            {shouldShowCancelAction ? (
              <Button
                variant="outline"
                onClick={() => setIsCancelDialogOpen(true)}
                disabled={!booking.actions.can_cancel}
              >
                Cancel booking
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <CancelBookingDialog
        bookingId={booking.id}
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      />
    </>
  )
}
