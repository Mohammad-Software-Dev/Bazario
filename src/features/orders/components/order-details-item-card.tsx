import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CancelBookingDialog } from '@/features/orders/components/cancel-booking-dialog'
import { OrderStatusBadge } from '@/features/orders/components/order-status-badge'
import {
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

function getItemKindLabel(item: OrderItemRecord) {
  return item.service_booking ? 'Service' : 'Product'
}

function canManageBooking(item: OrderItemRecord) {
  const status = item.service_booking?.status

  if (!status) {
    return false
  }

  return !['completed', 'cancelled_by_customer', 'cancelled_by_provider'].includes(status)
}

export function OrderDetailsItemCard({ item, currencyIso }: OrderDetailsItemCardProps) {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const latestRefund = getLatestRefund(item)
  const booking = item.service_booking

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
              <span>{getItemKindLabel(item)}</span>
              {item.quantity > 1 ? <span>Quantity: {item.quantity}</span> : null}
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
                  <p className="font-medium text-foreground">Booking</p>
                  <OrderStatusBadge status={booking.status} />
                </div>
                <p>{formatBookingWindow(booking.starts_at, booking.ends_at, booking.timezone)}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span>{booking.timezone ?? 'UTC'}</span>
                  {booking.location_type ? <span>{booking.location_type}</span> : null}
                </div>
              </div>

              {canManageBooking(item) ? (
                <div className="flex flex-wrap gap-2 md:justify-end">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/account/bookings/${booking.id}/reschedule`}>Reschedule</Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsCancelDialogOpen(true)}>
                    Cancel booking
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {latestRefund ? (
          <div className="rounded-2xl border border-dashed border-border/80 px-4 py-3 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-medium text-foreground">Refund</p>
                <span>Status: {latestRefund.status ?? 'Pending'}</span>
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
