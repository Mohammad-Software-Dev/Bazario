import type { AddProductToCartInput } from '@/features/cart/types/cart.types'
import type { ProductListItem } from '@/features/products/types/product.types'
import { getLocalizedValue } from '@/lib/localized-value'

export function buildProductCartItem(product: ProductListItem, quantity = 1): AddProductToCartInput {
  return {
    product_id: product.id,
    quantity: quantity < 1 ? 1 : quantity,
    name: getLocalizedValue(product.name) || 'Untitled product',
    image: product.images[0]?.image ?? null,
    price: product.price,
    seller_name: product.seller?.store_name ?? 'Independent seller',
    category_name: getLocalizedValue(product.category?.name) || undefined,
  }
}
