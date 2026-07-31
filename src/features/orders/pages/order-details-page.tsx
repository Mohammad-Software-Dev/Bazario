import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderDetailsItemCard } from '@/features/orders/components/order-details-item-card'
import { OrderStatusBadge } from '@/features/orders/components/order-status-badge'
import { useDeleteOrderMutation } from '@/features/orders/hooks/use-delete-order-mutation'
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
  const navigate = useNavigate()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { orderId: orderIdParam } = useParams()
  const orderId = parseOrderId(orderIdParam)
  const orderQuery = useOrderQuery(orderId ?? 0, Boolean(orderId))
  const startCheckoutSessionMutation = useStartCheckoutSessionMutation()
  const deleteOrderMutation = useDeleteOrderMutation()

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
  const canDelete = order?.status === 'draft' || order?.status === 'requires_payment'
  const isDeleting = deleteOrderMutation.isPending && deleteOrderMutation.variables === order?.id
  const isStartingCheckout =
    startCheckoutSessionMutation.isPending && startCheckoutSessionMutation.variables === order?.id

  function handleDeleteOrder() {
    if (!order) {
      return
    }

    deleteOrderMutation.mutate(order.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
        navigate('/account/orders')
      },
    })
  }

  return (
    <>
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
                      Your order is saved, but payment is still pending. Complete checkout to confirm it.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Button
                      onClick={() => startCheckoutSessionMutation.mutate(order.id)}
                      disabled={startCheckoutSessionMutation.isPending || isDeleting}
                    >
                      {startCheckoutSessionMutation.isPending
                        ? 'Starting checkout...'
                        : 'Complete payment'}
                    </Button>
                    {canDelete ? (
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(true)} disabled={isDeleting || isStartingCheckout}>
                        {isDeleting ? 'Deleting...' : 'Delete order'}
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {deleteOrderMutation.isError && deleteOrderMutation.variables === order.id ? (
              <Card className="border-border/70 shadow-sm">
                <CardContent className="py-4 text-sm text-destructive">
                  {getApiErrorMessage(deleteOrderMutation.error, 'Unable to delete this order right now.')}
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

      {order ? (
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title={`Delete order #${order.id}`}
          description="This will remove the unpaid order and its items. This action cannot be undone."
          confirmLabel={isDeleting ? 'Deleting...' : 'Delete order'}
          cancelLabel="Keep order"
          onConfirm={handleDeleteOrder}
          isPending={isDeleting}
          variant="destructive"
        />
      ) : null}
    </>
  )
}
