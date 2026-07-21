import { Card, CardContent } from '@/components/ui/card'
import { formatBookingWindow, formatOrderMoney, getLatestRefund, getOrderItemDisplayTitle } from '@/features/orders/lib/order-format'
import type { OrderItemRecord } from '@/features/orders/types/order.types'
import { OrderStatusBadge } from '@/features/orders/components/order-status-badge'

interface OrderItemListProps {
  items: OrderItemRecord[]
  currencyIso: string
}

export function OrderItemList({ items, currencyIso }: OrderItemListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const latestRefund = getLatestRefund(item)

        return (
          <Card key={item.id}>
            <CardContent className="space-y-4 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <p className="text-base font-semibold text-foreground">{getOrderItemDisplayTitle(item)}</p>
                  {item.description_snapshot ? (
                    <p className="text-sm text-muted-foreground">{item.description_snapshot}</p>
                  ) : null}
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <div className="flex flex-col items-start gap-2 md:items-end">
                  <OrderStatusBadge status={item.status} />
                  <p className="font-medium text-foreground">{formatOrderMoney(item.gross_amount, currencyIso)}</p>
                </div>
              </div>

              {item.service_booking ? (
                <div className="rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
                  <p>{formatBookingWindow(item.service_booking.starts_at, item.service_booking.ends_at, item.service_booking.timezone)}</p>
                  {item.service_booking.location_type ? <p>Location: {item.service_booking.location_type}</p> : null}
                </div>
              ) : null}

              {latestRefund ? (
                <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Refund</p>
                  <p>Status: {latestRefund.status ?? 'Pending'}</p>
                  <p>Amount: {formatOrderMoney(latestRefund.amount, latestRefund.currency_iso)}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
