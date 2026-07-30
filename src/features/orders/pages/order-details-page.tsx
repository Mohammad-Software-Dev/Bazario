import { Link, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderDetailsItemCard } from '@/features/orders/components/order-details-item-card'
import { OrderStatusBadge } from '@/features/orders/components/order-status-badge'
import { useOrderQuery } from '@/features/orders/hooks/use-order-query'
import { useStartCheckoutSessionMutation } from '@/features/orders/hooks/use-start-checkout-session-mutation'
import {
  formatOrderDate,
  formatOrderMoney,
  getOrderPrimaryDate,
} from '@/features/orders/lib/order-format'
import { getApiErrorMessage } from '@/lib/api/api-error'

function parseOrderId(value: string | undefined) {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 1) {
    return null
  }

  return parsed
}

export function OrderDetailsPage() {
  const { orderId: orderIdParam } = useParams()
  const orderId = parseOrderId(orderIdParam)
  const orderQuery = useOrderQuery(orderId ?? 0, Boolean(orderId))
  const startCheckoutSessionMutation = useStartCheckoutSessionMutation()

  if (!orderId) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
        <Card className="border-border/70 shadow-sm">
          <CardContent className="py-6 text-sm text-destructive">Invalid order id.</CardContent>
        </Card>
      </div>
    )
  }

  const order = orderQuery.data

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Account
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Order #{orderId}
            </h1>
            {order ? <OrderStatusBadge status={order.status} /> : null}
          </div>
        </div>

        <Button asChild variant="outline">
          <Link to="/account/orders">Back to orders</Link>
        </Button>
      </div>

      {orderQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading order...</p>
      ) : null}
      {orderQuery.isError ? (
        <Card className="border-border/70 shadow-sm">
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(orderQuery.error, 'Unable to load this order right now.')}
          </CardContent>
        </Card>
      ) : null}

      {order ? (
        <>
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 p-6 md:grid-cols-3 lg:grid-cols-4">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Placed
                </p>
                <p className="font-medium text-foreground">
                  {formatOrderDate(getOrderPrimaryDate(order))}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Payment
                </p>
                <p className="font-medium text-foreground">
                  {order.stripe_payment?.status ?? 'Not paid'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Items
                </p>
                <p className="font-medium text-foreground">{order.items.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Total
                </p>
                <p className="font-medium text-foreground">
                  {formatOrderMoney(order.total_amount, order.currency_iso)}
                </p>
              </div>
            </CardContent>
          </Card>

          {order.status === 'requires_payment' ? (
            <Card className="border-border/70 shadow-sm">
              <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Payment still required</p>
                  <p className="text-sm text-muted-foreground">
                    This order exists, but checkout has not been completed yet.
                  </p>
                </div>
                <Button
                  onClick={() => startCheckoutSessionMutation.mutate(order.id)}
                  disabled={startCheckoutSessionMutation.isPending}
                >
                  {startCheckoutSessionMutation.isPending
                    ? 'Starting checkout...'
                    : 'Complete payment'}
                </Button>
              </CardContent>
            </Card>
          ) : null}

          <section className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Order items</h2>
            </div>
            <div className="space-y-3">
              {order.items.map((item) => (
                <OrderDetailsItemCard
                  key={item.id}
                  item={item}
                  currencyIso={order.currency_iso}
                />
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}
