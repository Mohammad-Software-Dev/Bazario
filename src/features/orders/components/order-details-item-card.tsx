import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CancelBookingDialog } from '@/features/orders/components/cancel-booking-dialog'
import { OrderStatusBadge } from '@/features/orders/components/order-status-badge'
import {
  formatBookingCutoff,
  formatBookingWindow,
  formatOrderMoney,
  getLatestRefund,
  getOrderItemDisplayTitle,
} from '@/features/orders/lib/order-format'
import type { OrderItemRecord } from '@/features/orders/types/order.types'

interface OrderDetailsItemCardProps {
  item: OrderItemRecord
  currencyIso: string
}

function getItemKindLabel(item: OrderItemRecord, t: (key: string, options?: Record<string, unknown>) => string) {
  return item.service_booking ? t('orders.service') : t('orders.product')
}

function canManageBooking(item: OrderItemRecord) {
  const status = item.service_booking?.status

  if (!status) {
    return false
  }

  return !['completed', 'cancelled_by_customer', 'cancelled_by_provider'].includes(status)
}

function getCutoffDeadline(startsAt: string, cutoffHours: number | null | undefined) {
  if (!cutoffHours || cutoffHours <= 0) {
    return null
  }

  const startsAtMs = new Date(startsAt).getTime()

  if (Number.isNaN(startsAtMs)) {
    return null
  }

  return new Date(startsAtMs - cutoffHours * 60 * 60 * 1000).toISOString()
}

function isDeadlinePassed(deadline: string | null | undefined) {
  if (!deadline) {
    return false
  }

  return new Date(deadline).getTime() <= Date.now()
}

export function OrderDetailsItemCard({ item, currencyIso }: OrderDetailsItemCardProps) {
  const { t } = useTranslation()
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const latestRefund = getLatestRefund(item)
  const booking = item.service_booking
  const canShowBookingActions = canManageBooking(item)

  const actionState = useMemo(() => {
    if (!booking || !canShowBookingActions) {
      return {
        canReschedule: false,
        canCancel: false,
        rescheduleReason: null as string | null,
        cancelReason: null as string | null,
      }
    }

    const service = booking.service

    const rescheduleDeadline =
      booking.cutoffs?.reschedule_deadline ?? getCutoffDeadline(booking.starts_at, service?.edit_cutoff_hours ?? 24)
    const cancelDeadline =
      booking.cutoffs?.cancel_deadline ?? getCutoffDeadline(booking.starts_at, service?.cancel_cutoff_hours ?? 24)

    const rescheduleLatePolicy = service?.edit_late_policy ?? 'deny'
    const cancelLatePolicy = service?.cancel_late_policy ?? 'deny'

    const fallbackRescheduleBlocked =
      rescheduleLatePolicy !== 'allow' && isDeadlinePassed(rescheduleDeadline)
    const fallbackCancelBlocked = cancelLatePolicy !== 'allow' && isDeadlinePassed(cancelDeadline)

    const formattedRescheduleDeadline = formatBookingCutoff(rescheduleDeadline, booking.timezone)
    const formattedCancelDeadline = formatBookingCutoff(cancelDeadline, booking.timezone)

    const canReschedule = booking.actions?.can_reschedule ?? !fallbackRescheduleBlocked
    const canCancel = booking.actions?.can_cancel ?? !fallbackCancelBlocked

    const rescheduleReason =
      booking.actions?.reschedule_block_reason ??
      (fallbackRescheduleBlocked
        ? formattedRescheduleDeadline
          ? t('orders.rescheduleWindowPassedOn', { date: formattedRescheduleDeadline })
          : t('orders.rescheduleWindowPassed')
        : null)

    const cancelReason =
      booking.actions?.cancel_block_reason ??
      (fallbackCancelBlocked
        ? formattedCancelDeadline
          ? t('orders.cancellationWindowPassedOn', { date: formattedCancelDeadline })
          : t('orders.cancellationWindowPassed')
        : null)

    return {
      canReschedule,
      canCancel,
      rescheduleReason,
      cancelReason,
    }
  }, [booking, canShowBookingActions, t])

  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">{getOrderItemDisplayTitle(item)}</h3>
              <OrderStatusBadge status={item.status} />
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>{getItemKindLabel(item, t)}</span>
              {item.quantity > 1 ? <span>{t('orders.quantity', { count: item.quantity })}</span> : null}
            </div>

            {item.description_snapshot ? (
              <p className="text-sm text-muted-foreground">{item.description_snapshot}</p>
            ) : null}
          </div>

          <div className="lg:text-right">
            <p className="text-lg font-semibold text-foreground">{formatOrderMoney(item.gross_amount, currencyIso)}</p>
          </div>
        </div>

        {booking ? (
          <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-foreground">{t('orders.booking')}</p>
                  <OrderStatusBadge status={booking.status} />
                </div>
                <p>{formatBookingWindow(booking.starts_at, booking.ends_at, booking.timezone)}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span>{booking.timezone ?? 'UTC'}</span>
                  {booking.location_type ? <span>{booking.location_type}</span> : null}
                </div>
              </div>

              {canShowBookingActions ? (
                <div className="space-y-2 md:text-right">
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    {actionState.canReschedule ? (
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/account/bookings/${booking.id}/reschedule`}>{t('orders.reschedule')}</Link>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        {t('orders.reschedule')}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCancelDialogOpen(true)}
                      disabled={!actionState.canCancel}
                    >
                      {t('orders.cancelBooking')}
                    </Button>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    {!actionState.canReschedule && actionState.rescheduleReason ? <p>{actionState.rescheduleReason}</p> : null}
                    {!actionState.canCancel && actionState.cancelReason ? <p>{actionState.cancelReason}</p> : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {latestRefund ? (
          <div className="rounded-2xl border border-dashed border-border/80 px-4 py-3 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-medium text-foreground">{t('orders.refund')}</p>
                <span>{t('orders.refundStatus', { status: latestRefund.status ?? t('orders.pending') })}</span>
              </div>
              <p className="font-medium text-foreground">{formatOrderMoney(latestRefund.amount, latestRefund.currency_iso)}</p>
            </div>
          </div>
        ) : null}
      </CardContent>

      {booking ? (
        <CancelBookingDialog
          bookingId={booking.id}
          open={isCancelDialogOpen}
          onOpenChange={setIsCancelDialogOpen}
        />
      ) : null}
    </Card>
  )
}
