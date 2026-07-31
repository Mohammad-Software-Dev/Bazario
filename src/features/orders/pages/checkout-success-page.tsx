import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartActions } from '@/features/cart/hooks/use-cart'
import { formatOrderMoney } from '@/features/orders/lib/order-format'
import { useCheckoutResultQuery } from '@/features/orders/hooks/use-checkout-result-query'
import { getApiErrorMessage } from '@/lib/api/api-error'

function parseOrderId(value: string | null) {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 1) {
    return null
  }

  return parsed
}

export function CheckoutSuccessPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const { clearCart } = useCartActions()
  const hasHandledSuccessRef = useRef(false)

  const orderId = parseOrderId(searchParams.get('order_id'))
  const sessionId = searchParams.get('session_id') || ''
  const isParamsValid = Boolean(orderId && sessionId)

  const checkoutResultQuery = useCheckoutResultQuery(orderId ?? 0, sessionId, isParamsValid)

  useEffect(() => {
    if (!checkoutResultQuery.data?.is_paid || hasHandledSuccessRef.current) {
      return
    }

    hasHandledSuccessRef.current = true
    clearCart()
    queryClient.invalidateQueries({ queryKey: ['orders', orderId] })
    queryClient.invalidateQueries({ queryKey: ['orders', 'current'] })
    queryClient.invalidateQueries({ queryKey: ['orders', 'mine'] })
    queryClient.invalidateQueries({ queryKey: ['bookings', 'mine'] })
  }, [checkoutResultQuery.data?.is_paid, clearCart, orderId, queryClient])

  if (!isParamsValid) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>{t('checkout.invalidSuccessTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>{t('checkout.invalidSuccessDescription')}</p>
            <Button asChild variant="outline">
              <Link to="/cart">{t('common.backToCart')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const order = checkoutResultQuery.data?.order

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{t('checkout.eyebrow')}</p>
        <h1 className="font-heading text-3xl font-semibold text-foreground">{t('checkout.successTitle')}</h1>
      </div>

      {checkoutResultQuery.isLoading ? <p className="text-sm text-muted-foreground">{t('checkout.confirmingPayment')}</p> : null}
      {checkoutResultQuery.isError ? (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(checkoutResultQuery.error, t('checkout.successError'))}
          </CardContent>
        </Card>
      ) : null}

      {checkoutResultQuery.data ? (
        <Card>
          <CardHeader>
            <CardTitle>{checkoutResultQuery.data.is_paid ? t('checkout.paymentConfirmed') : t('checkout.paymentPending')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              {checkoutResultQuery.data.is_paid
                ? t('checkout.paymentConfirmedDescription')
                : t('checkout.paymentPendingDescription')}
            </p>
            {order ? (
              <div className="rounded-lg border p-4 text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">{t('orders.orderLabel', { id: order.id })}</span>
                </p>
                <p>
                  <span className="font-medium text-foreground">{t('orders.payment')}:</span> {t(`statuses.${order.status}`, { defaultValue: order.status })}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t('orders.total')}:</span> {formatOrderMoney(order.total_amount, order.currency_iso)}
                </p>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              {checkoutResultQuery.data.is_paid ? (
                <>
                  <Button asChild>
                    <Link to="/account/orders">{t('checkout.viewMyOrders')}</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/account/bookings">{t('checkout.viewMyBookings')}</Link>
                  </Button>
                </>
              ) : (
                <Button asChild variant="outline">
                  <Link to="/cart">{t('common.backToCart')}</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
