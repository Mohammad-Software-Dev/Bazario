import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ProductListItem } from '@/features/products/types/product.types'
import { resolveMediaUrl } from '@/lib/api/asset-url'
import { formatMoney } from '@/lib/i18n/format'
import { getLocalizedValue } from '@/lib/localized-value'

interface SellerProductCardProps {
  onDelete: (product: ProductListItem) => void
  product: ProductListItem
}

export function SellerProductCard({ product, onDelete }: SellerProductCardProps) {
  const { t } = useTranslation()
  const imageUrl = resolveMediaUrl(product.images[0]?.image_url, product.images[0]?.image)
  const productName = getLocalizedValue(product.name) || t('common.untitledProduct')
  const productDescription = getLocalizedValue(product.description) || t('common.noDescriptionYet')
  const categoryName = getLocalizedValue(product.category?.name) || t('common.uncategorized')

  return (
    <Card className="overflow-hidden pt-0">
      <div className="aspect-[4/3] bg-muted">
        {imageUrl ? (
          <img src={imageUrl} alt={productName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            {t('common.noImage')}
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
            <span>{t('details.category')}</span>
            <span className="text-foreground">{categoryName}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>{t('details.price')}</span>
            <span className="text-foreground">{formatMoney(product.price)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to={`/products/${product.id}`}>{t('common.viewDetails')}</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to={`/account/seller/products/${product.id}/edit`}>{t('common.edit')}</Link>
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(product)}>
            {t('common.delete')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
