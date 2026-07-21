import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ProductListItem } from '@/features/products/types/product.types'
import { buildAssetUrl } from '@/lib/api/asset-url'
import { getLocalizedValue } from '@/lib/localized-value'

interface SellerProductCardProps {
  onDelete: (product: ProductListItem) => void
  product: ProductListItem
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function SellerProductCard({ product, onDelete }: SellerProductCardProps) {
  const imageUrl = buildAssetUrl(product.images[0]?.image)
  const productName = getLocalizedValue(product.name) || 'Untitled product'
  const productDescription = getLocalizedValue(product.description) || 'No description yet.'
  const categoryName = getLocalizedValue(product.category?.name) || 'Uncategorized'

  return (
    <Card className="overflow-hidden pt-0">
      <div className="aspect-[4/3] bg-muted">
        {imageUrl ? (
          <img src={imageUrl} alt={productName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <CardHeader className="space-y-2">
        <CardTitle className="line-clamp-1">{productName}</CardTitle>
        <CardDescription className="line-clamp-2 min-h-10">{productDescription}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <div className="grid gap-2 text-muted-foreground">
          <div className="flex items-center justify-between gap-3">
            <span>Category</span>
            <span className="text-foreground">{categoryName}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Price</span>
            <span className="text-foreground">{formatMoney(product.price)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to={`/products/${product.id}`}>View</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to={`/account/seller/products/${product.id}/edit`}>Edit</Link>
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(product)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
