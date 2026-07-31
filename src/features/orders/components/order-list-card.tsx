import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
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

function getOrderMixLabel(order: OrderRecord, t: (key: string, options?: Record<string, unknown>) => string) {
  const serviceCount = order.items.filter((item) => item.service_booking).length
  const productCount = order.items.length - serviceCount

  if (productCount > 0 && serviceCount > 0) {
    return t('orders.productsAndServices')
  }

  if (serviceCount > 0) {
    return t(serviceCount === 1 ? 'orders.serviceBooking_one' : 'orders.serviceBooking_other')
  }

  return t(productCount === 1 ? 'orders.productOrder_one' : 'orders.productOrder_other')
}

function getItemSummary(order: OrderRecord, t: (key: string, options?: Record<string, unknown>) => string) {
  const titles = order.items.map(getOrderItemDisplayTitle).filter(Boolean)

  if (!titles.length) {
    return t('orders.noItemsAdded')
  }

  if (titles.length === 1) {
    return titles[0]
  }

  const visibleTitles = titles.slice(0, 2).join(', ')
  const remainingCount = titles.length - 2

  if (remainingCount > 0) {
    return `${visibleTitles} ${t('orders.moreItems', { count: remainingCount })}`
  }

  return visibleTitles
}

export function OrderListCard({ order }: OrderListCardProps) {
  const { t } = useTranslation()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const startCheckoutSessionMutation = useStartCheckoutSessionMutation()
  const deleteOrderMutation = useDeleteOrderMutation()
  const canDelete = order.status === 'draft' || order.status === 'requires_payment'
  const isDeleting = deleteOrderMutation.isPending && deleteOrderMutation.variables === order.id
  const isStartingCheckout = startCheckoutSessionMutation.isPending && startCheckoutSessionMutation.variables === order.id

  function handleDeleteOrder() {
    deleteOrderMutation.mutate(order.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
      },
    })
  }

  return (
    <>
      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-4 md:p-5">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_180px_120px_220px] xl:items-center">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">{t('orders.orderLabel', { id: order.id })}</h2>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>{formatOrderDate(getOrderPrimaryDate(order))}</span>
                <span>{t('orders.itemCount', { count: order.items.length })}</span>
              </div>

              <p className="truncate text-sm text-muted-foreground">{getItemSummary(order, t)}</p>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground xl:justify-self-start">
              <span>{getOrderMixLabel(order, t)}</span>
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
                  {isStartingCheckout ? t('orders.starting') : t('orders.completePayment')}
                </Button>
              ) : null}

              {canDelete ? (
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(true)} disabled={isDeleting || isStartingCheckout} size="sm">
                  {isDeleting ? t('orders.deleting') : t('orders.deleteOrder')}
                </Button>
              ) : null}

              <Button asChild variant="outline" size="sm">
                <Link to={`/account/orders/${order.id}`}>{t('common.viewDetails')}</Link>
              </Button>
            </div>
          </div>

          {deleteOrderMutation.isError && deleteOrderMutation.variables === order.id ? (
            <p className="mt-3 text-sm text-destructive">
              {getApiErrorMessage(deleteOrderMutation.error, t('orders.deleteOrderError'))}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={t('orders.deleteOrderTitle', { id: order.id })}
        description={t('orders.deleteOrderDescription')}
        confirmLabel={isDeleting ? t('orders.deleting') : t('orders.deleteOrderFull')}
        cancelLabel={t('orders.keepOrder')}
        onConfirm={handleDeleteOrder}
        isPending={isDeleting}
        variant="destructive"
      />
    </>
  )
}
