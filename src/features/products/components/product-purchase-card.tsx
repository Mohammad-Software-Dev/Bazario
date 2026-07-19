import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCartActions } from '@/features/cart/hooks/use-cart'
import type { ProductListItem } from '@/features/products/types/product.types'
import { getLocalizedValue } from '@/lib/localized-value'

interface ProductPurchaseCardProps {
  product: ProductListItem
}

export function ProductPurchaseCard({ product }: ProductPurchaseCardProps) {
  const { addProductItem } = useCartActions()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  function handleAddToCart() {
    const nextQuantity = Number.isFinite(quantity) ? quantity : 1

    addProductItem({
      product_id: product.id,
      quantity: nextQuantity < 1 ? 1 : nextQuantity,
      name: getLocalizedValue(product.name) || 'Untitled product',
      image: product.images[0]?.image ?? null,
      price: product.price,
      seller_name: product.seller?.store_name ?? 'Independent seller',
      category_name: getLocalizedValue(product.category?.name) || undefined,
    })

    setIsAdded(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add to cart</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="product-quantity" className="text-sm font-medium text-foreground">
            Quantity
          </label>
          <Input
            id="product-quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => {
              setQuantity(Number(event.target.value))
              setIsAdded(false)
            }}
          />
        </div>

        <Button onClick={handleAddToCart} className="w-full">
          Add to cart
        </Button>

        {isAdded ? <p className="text-sm text-muted-foreground">Added to cart.</p> : null}
      </CardContent>
    </Card>
  )
}
