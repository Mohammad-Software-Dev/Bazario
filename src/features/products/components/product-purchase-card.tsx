import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCartActions } from '@/features/cart/hooks/use-cart'
import { buildProductCartItem } from '@/features/products/lib/build-product-cart-item'
import type { ProductListItem } from '@/features/products/types/product.types'

interface ProductPurchaseCardProps {
  product: ProductListItem
}

export function ProductPurchaseCard({ product }: ProductPurchaseCardProps) {
  const { addProductItem } = useCartActions()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  function handleAddToCart() {
    const nextQuantity = Number.isFinite(quantity) ? quantity : 1

    addProductItem(buildProductCartItem(product, nextQuantity))
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
