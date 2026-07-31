import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { formatCartMoney } from '@/features/cart/lib/cart-calculations'
import type { CartSummary as CartSummaryType } from '@/features/cart/types/cart.types'

interface CartSummaryProps {
  onCheckout: () => void
  onClear: () => void
  summary: CartSummaryType
  checkoutLabel?: string
  isCheckoutPending?: boolean
}

export function CartSummary({
  onCheckout,
  onClear,
  summary,
  checkoutLabel,
  isCheckoutPending = false,
}: CartSummaryProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('common.summary')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">{t('cart.items')}</span>
          <span className="text-foreground">{summary.item_count}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">{t('cart.products')}</span>
          <span className="text-foreground">{summary.product_count}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">{t('cart.services')}</span>
          <span className="text-foreground">{summary.service_count}</span>
        </div>
        <div className="flex items-center justify-between gap-3 border-t pt-4">
          <span className="font-medium text-foreground">{t('common.subtotal')}</span>
          <span className="font-semibold text-foreground">{formatCartMoney(summary.subtotal)}</span>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={onCheckout} disabled={summary.item_count === 0 || isCheckoutPending}>
            {isCheckoutPending ? t('cart.startingCheckout') : checkoutLabel ?? t('cart.checkout')}
          </Button>
          <Button variant="outline" onClick={onClear} disabled={summary.item_count === 0 || isCheckoutPending}>
            {t('common.clearCart')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
