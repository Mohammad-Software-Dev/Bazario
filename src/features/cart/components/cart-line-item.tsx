import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { buildAssetUrl } from '@/lib/api/asset-url'

import { formatCartBookingWindow, formatCartMoney } from '@/features/cart/lib/cart-calculations'
import type { CartItem } from '@/features/cart/types/cart.types'

interface CartLineItemProps {
  item: CartItem
  onRemove: (cartItemId: string) => void
  onQuantityChange: (cartItemId: string, quantity: number) => void
}

export function CartLineItem({ item, onRemove, onQuantityChange }: CartLineItemProps) {
  const imageUrl = buildAssetUrl(item.image)

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-start">
      <div className="h-24 w-full overflow-hidden rounded-lg bg-muted md:w-32">
        {imageUrl ? (
          <img src={imageUrl} alt={item.type === 'product' ? item.name : item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {item.type === 'product' ? 'Product' : 'Service'}
            </p>
            <h3 className="text-base font-semibold text-foreground">
              {item.type === 'product' ? item.name : item.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {item.type === 'product' ? item.seller_name : item.provider_name}
            </p>
            {item.category_name ? <p className="text-sm text-muted-foreground">{item.category_name}</p> : null}
          </div>
          <p className="text-base font-semibold text-foreground">{formatCartMoney(item.price * item.quantity)}</p>
        </div>

        {item.type === 'service' ? (
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>{formatCartBookingWindow(item)}</p>
            <p>Timezone: {item.timezone}</p>
            {item.location_type ? <p>Location: {item.location_type}</p> : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {item.type === 'product' ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Quantity</span>
              <Input
                type="number"
                min={0}
                value={item.quantity}
                onChange={(event) => onQuantityChange(item.cart_item_id, Number(event.target.value))}
                className="w-20"
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">1 booking</p>
          )}

          <Button variant="outline" onClick={() => onRemove(item.cart_item_id)}>
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}
