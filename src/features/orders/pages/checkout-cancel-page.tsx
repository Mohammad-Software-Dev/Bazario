import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function parseOrderId(value: string | null) {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 1) {
    return null
  }

  return parsed
}

export function CheckoutCancelPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const orderId = parseOrderId(searchParams.get('order_id'))

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{t('checkout.eyebrow')}</p>
        <h1 className="font-heading text-3xl font-semibold text-foreground">{t('checkout.cancelTitle')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('checkout.cancelCardTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            {t('checkout.cancelDescription')}
          </p>

          {orderId ? (
            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              <p>{t('orders.orderLabel', { id: orderId })}</p>
              <p>{t('checkout.cancelOrderHint')}</p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/cart">{t('common.backToCart')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/account/orders">{t('checkout.viewMyOrders')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
