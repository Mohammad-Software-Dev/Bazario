import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Card, CardContent } from '@/components/ui/card'
import type { ProductListItem } from '@/features/products/types/product.types'
import { buildAssetUrl } from '@/lib/api/asset-url'
import { formatMoney } from '@/lib/i18n/format'
import { getLocalizedValue } from '@/lib/localized-value'

interface ProductPreviewCardProps {
  product: ProductListItem
}

export function ProductPreviewCard({ product }: ProductPreviewCardProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const imageUrl = buildAssetUrl(product.images[0]?.image)
  const storeName = product.seller?.store_name ?? t('catalog.independentSeller')
  const sellerUserName = product.seller?.user?.name ?? t('catalog.sellerProfilePending')
  const productName = getLocalizedValue(product.name) || t('common.untitledProduct')
  const productDescription = getLocalizedValue(product.description) || t('common.noDescriptionYet')
  const categoryName = getLocalizedValue(product.category?.name) || t('common.uncategorized')

  function handleOpenProduct() {
    navigate(`/products/${product.id}`)
  }

  function handleCardKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOpenProduct()
    }
  }

  return (
    <Card
      className="cursor-pointer overflow-hidden border-border/70 bg-card/90 pt-0 shadow-sm transition-colors hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      role="link"
      tabIndex={0}
      onClick={handleOpenProduct}
      onKeyDown={handleCardKeyDown}
    >
      <div className="aspect-4/3 bg-muted">
        {imageUrl ? (
          <img src={imageUrl} alt={productName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-stone-100 to-stone-200 text-sm text-muted-foreground">
            {t('common.noImage')}
          </div>
        )}
      </div>

      <CardContent className="space-y-4 p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <h3 className="line-clamp-2 text-lg font-semibold text-foreground">{productName}</h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">{productDescription}</p>
            </div>
            {product.isNew ? (
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {t('catalog.new')}
              </span>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {categoryName}
            </span>
            <span className="text-lg font-semibold text-foreground">{formatMoney(product.price)}</span>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 px-3 py-2.5 text-sm">
          <p className="line-clamp-1 font-medium text-foreground">{storeName}</p>
          <p className="line-clamp-1 text-muted-foreground">{t('catalog.bySeller', { name: sellerUserName })}</p>
        </div>
      </CardContent>
    </Card>
  )
}
