import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
      ? t('bookings.availableUntil', { date: cancelDeadline })
      : t('bookings.availableUntilServiceStarts')
    : booking.actions.cancel_block_reason ?? t('bookings.cancellationUnavailable')
  const rescheduleSummary = booking.actions.can_reschedule
    ? rescheduleDeadline
      ? t('bookings.availableUntil', { date: rescheduleDeadline })
      : t('bookings.availableUntilServiceStarts')
    : booking.actions.reschedule_block_reason ?? t('bookings.reschedulingUnavailable')
  const unavailableSummaries = [
    !booking.actions.can_reschedule ? rescheduleSummary : null,
    !booking.actions.can_cancel ? cancelSummary : null,
  ].filter(Boolean)

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
            <p>{t('bookings.timezone', { value: booking.timezone ?? 'UTC' })}</p>
            {booking.location_type ? <p>{t('bookings.location', { value: booking.location_type })}</p> : null}
          </div>

          <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-3">
            <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-6">
              <p>
                <span className="font-medium text-foreground">{t('bookings.cancellation')}:</span>{' '}
                {cancelSummary}
              </p>
              <p>
                <span className="font-medium text-foreground">{t('bookings.rescheduling')}:</span>{' '}
                {rescheduleSummary}
              </p>
            </div>
          </div>

          {refundSummary ? (
            <div className="rounded-lg border border-dashed p-3 text-muted-foreground">
              <p className="font-medium text-foreground">{t('bookings.refund')}</p>
              <p>{t('orders.refundStatus', { status: refundSummary.status ?? t('orders.pending') })}</p>
              {refundSummary.amount !== null && refundSummary.currency_iso ? (
                <p>{t('orders.refundAmount', { amount: formatOrderMoney(refundSummary.amount, refundSummary.currency_iso) })}</p>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-2">
            <div className="flex flex-wrap gap-3">
              {shouldShowRescheduleAction ? (
                booking.actions.can_reschedule ? (
                  <Button asChild variant="outline">
                    <Link to={`/account/bookings/${booking.id}/reschedule`}>{t('orders.reschedule')}</Link>
                  </Button>
                ) : (
                  <Button variant="outline" disabled>
                    {t('orders.reschedule')}
                  </Button>
                )
              ) : null}

              {shouldShowCancelAction ? (
                <Button
                  variant="outline"
                  onClick={() => setIsCancelDialogOpen(true)}
                  disabled={!booking.actions.can_cancel}
                >
                  {t('orders.cancelBooking')}
                </Button>
              ) : null}
            </div>

            {unavailableSummaries.length ? (
              <p className="text-sm text-muted-foreground">{unavailableSummaries.join(' ')}</p>
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
