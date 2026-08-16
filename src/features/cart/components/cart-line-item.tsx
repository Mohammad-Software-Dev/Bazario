import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { buildAssetUrl } from '@/lib/api/asset-url'

import { formatCartBookingWindow, formatCartMoney } from '@/features/cart/lib/cart-calculations'
import type { CartItem } from '@/features/cart/types/cart.types'
import { getLocationTypeLabel } from '@/features/services/lib/location-type'

interface CartLineItemProps {
  item: CartItem
  onRemove: (cartItemId: string) => void
  onQuantityChange: (cartItemId: string, quantity: number) => void
}

export function CartLineItem({ item, onRemove, onQuantityChange }: CartLineItemProps) {
  const { t } = useTranslation()
  const imageUrl = buildAssetUrl(item.image)
  const lineTotal = item.price * item.quantity

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 md:flex-row md:items-start">
      <div className="h-24 w-full overflow-hidden rounded-lg bg-muted md:w-32">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.type === 'product' ? item.name : item.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            {t('common.noImage')}
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {item.type === 'product' ? t('orders.product') : t('orders.service')}
            </p>
            <h3 className="text-base font-semibold text-foreground">
              {item.type === 'product' ? item.name : item.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {item.type === 'product' ? item.seller_name : item.provider_name}
            </p>
            {item.category_name ? <p className="text-sm text-muted-foreground">{item.category_name}</p> : null}
          </div>
          <div className="space-y-1 text-left md:text-right">
            <p className="text-sm text-muted-foreground">{t('cart.unitPrice')}: {formatCartMoney(item.price)}</p>
            <p className="text-base font-semibold text-foreground">{t('cart.lineTotal')}: {formatCartMoney(lineTotal)}</p>
          </div>
        </div>

        {item.type === 'service' ? (
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>{formatCartBookingWindow(item)}</p>
            <p>{t('bookings.timezone', { value: item.timezone })}</p>
            {getLocationTypeLabel(item.location_type, t) ? (
              <p>{t('bookings.location', { value: getLocationTypeLabel(item.location_type, t) })}</p>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {item.type === 'product' ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t('cart.quantity')}</span>
              <Input
                type="number"
                min={0}
                value={item.quantity}
                onChange={(event) => onQuantityChange(item.cart_item_id, Number(event.target.value))}
                className="w-20"
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t('cart.oneBooking')}</p>
          )}

          <Button variant="outline" onClick={() => onRemove(item.cart_item_id)}>
            {t('common.remove')}
          </Button>
        </div>
      </div>
    </div>
  )
}
