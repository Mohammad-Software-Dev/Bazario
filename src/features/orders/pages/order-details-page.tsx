import { Link, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderItemList } from '@/features/orders/components/order-item-list'
import { OrderStatusBadge } from '@/features/orders/components/order-status-badge'
import { formatOrderDate, formatOrderMoney, getOrderPrimaryDate } from '@/features/orders/lib/order-format'
import { useOrderQuery } from '@/features/orders/hooks/use-order-query'
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

  if (!orderId) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-12">
        <Card>
          <CardContent className="py-6 text-sm text-destructive">Invalid order id.</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Order details</p>
          <h1 className="font-heading text-3xl font-semibold text-foreground">Order #{orderId}</h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/account/orders">Back to orders</Link>
        </Button>
      </div>

      {orderQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading order...</p> : null}
      {orderQuery.isError ? (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(orderQuery.error, 'Unable to load this order right now.')}
          </CardContent>
        </Card>
      ) : null}

      {orderQuery.data ? (
        <>
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <div className="space-y-1">
                <CardTitle>Summary</CardTitle>
                <p className="text-sm text-muted-foreground">{formatOrderDate(getOrderPrimaryDate(orderQuery.data))}</p>
              </div>
              <OrderStatusBadge status={orderQuery.data.status} />
            </CardHeader>
            <CardContent className="grid gap-3 text-sm md:grid-cols-2">
              <p>
                <span className="font-medium text-foreground">Total:</span>{' '}
                {formatOrderMoney(orderQuery.data.total_amount, orderQuery.data.currency_iso)}
              </p>
              <p>
                <span className="font-medium text-foreground">Payment status:</span>{' '}
                {orderQuery.data.stripe_payment?.status ?? 'Not paid'}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Items</h2>
            <OrderItemList items={orderQuery.data.items} currencyIso={orderQuery.data.currency_iso} />
          </div>
        </>
      ) : null}
    </div>
  )
}
