import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { OrderStatusBadge } from '@/features/orders/components/order-status-badge'
import { useDeleteOrderMutation } from '@/features/orders/hooks/use-delete-order-mutation'
import { useStartCheckoutSessionMutation } from '@/features/orders/hooks/use-start-checkout-session-mutation'
import { formatOrderDate, formatOrderMoney, getOrderItemDisplayTitle, getOrderPrimaryDate } from '@/features/orders/lib/order-format'
import type { OrderRecord } from '@/features/orders/types/order.types'
import { getApiErrorMessage } from '@/lib/api/api-error'

interface OrderListCardProps {
  order: OrderRecord
}

function getOrderMixLabel(order: OrderRecord) {
  const serviceCount = order.items.filter((item) => item.service_booking).length
  const productCount = order.items.length - serviceCount

  if (productCount > 0 && serviceCount > 0) {
    return 'Products and services'
  }

  if (serviceCount > 0) {
    return serviceCount === 1 ? 'Service booking' : 'Service bookings'
  }

  return productCount === 1 ? 'Product order' : 'Product orders'
}

function getItemSummary(order: OrderRecord) {
  const titles = order.items.map(getOrderItemDisplayTitle).filter(Boolean)

  if (!titles.length) {
    return 'No items added yet.'
  }

  if (titles.length === 1) {
    return titles[0]
  }

  const visibleTitles = titles.slice(0, 2).join(', ')
  const remainingCount = titles.length - 2

  if (remainingCount > 0) {
    return `${visibleTitles} +${remainingCount} more`
  }

  return visibleTitles
}

export function OrderListCard({ order }: OrderListCardProps) {
  const startCheckoutSessionMutation = useStartCheckoutSessionMutation()
  const deleteOrderMutation = useDeleteOrderMutation()
  const canDelete = order.status === 'draft' || order.status === 'requires_payment'
  const isDeleting = deleteOrderMutation.isPending && deleteOrderMutation.variables === order.id
  const isStartingCheckout = startCheckoutSessionMutation.isPending && startCheckoutSessionMutation.variables === order.id

  function handleDeleteOrder() {
    const confirmed = window.confirm(`Delete order #${order.id}?`)

    if (!confirmed) {
      return
    }

    deleteOrderMutation.mutate(order.id)
  }

  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="p-4 md:p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_180px_120px_220px] xl:items-center">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">Order #{order.id}</h2>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>{formatOrderDate(getOrderPrimaryDate(order))}</span>
              <span>{order.items.length} item{order.items.length === 1 ? '' : 's'}</span>
            </div>

            <p className="truncate text-sm text-muted-foreground">{getItemSummary(order)}</p>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground xl:justify-self-start">
            <span>{getOrderMixLabel(order)}</span>
          </div>

          <div className="xl:text-right">
            <p className="text-lg font-semibold text-foreground">{formatOrderMoney(order.total_amount, order.currency_iso)}</p>
          </div>

          <div className="flex flex-wrap gap-2 xl:justify-end">
            {order.status === 'requires_payment' ? (
              <Button
                onClick={() => startCheckoutSessionMutation.mutate(order.id)}
                disabled={isStartingCheckout || isDeleting}
                size="sm"
              >
                {isStartingCheckout ? 'Starting...' : 'Complete payment'}
              </Button>
            ) : null}

            {canDelete ? (
              <Button variant="outline" onClick={handleDeleteOrder} disabled={isDeleting || isStartingCheckout} size="sm">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            ) : null}

            <Button asChild variant="outline" size="sm">
              <Link to={`/account/orders/${order.id}`}>View details</Link>
            </Button>
          </div>
        </div>

        {deleteOrderMutation.isError && deleteOrderMutation.variables === order.id ? (
          <p className="mt-3 text-sm text-destructive">
            {getApiErrorMessage(deleteOrderMutation.error, 'Unable to delete this order right now.')}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
