import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Card, CardContent } from '@/components/ui/card'
import { buildAssetUrl } from '@/lib/api/asset-url'

import { AdTierBadge } from '@/features/ads/components/ad-tier-badge'
import { SponsoredBadge } from '@/features/ads/components/sponsored-badge'
import type { AdViewModel } from '@/features/ads/types/ad.types'

interface SponsoredAdCardProps {
  ad: AdViewModel
  variant?: 'default' | 'compact' | 'featured'
}

function CardBody({ ad, variant = 'default' }: SponsoredAdCardProps) {
  const { t } = useTranslation()
  const imageUrl = buildAssetUrl(ad.image)
  const isCompact = variant === 'compact'
  const isFeatured = variant === 'featured'
  const titleClassName = isCompact
    ? 'text-base leading-7 line-clamp-2 min-h-14'
    : isFeatured
      ? 'text-lg leading-7 line-clamp-2 min-h-14'
      : 'text-xl leading-8 line-clamp-2 min-h-16'

  return (
    <div className="flex h-full flex-col gap-4">
      <div
        className={`overflow-hidden rounded-2xl bg-muted ${
          isCompact ? 'aspect-[16/10]' : isFeatured ? 'aspect-[16/8]' : 'aspect-[16/9]'
        }`}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={ad.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {t('common.noImage')}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <SponsoredBadge />
          {ad.tier ? <AdTierBadge tier={ad.tier} /> : null}
        </div>

        <div className="space-y-2">
          <h3 className={`font-semibold text-foreground ${titleClassName}`}>
            {ad.title}
          </h3>
          {ad.subtitle ? (
            <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">{ad.subtitle}</p>
          ) : (
            <div className="min-h-10" />
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 text-sm">
          <div className="min-w-0 space-y-1">
            <p className="line-clamp-1 font-medium text-foreground">{ad.targetTitle}</p>
            {ad.ownerName ? <p className="text-muted-foreground">{ad.ownerName}</p> : null}
          </div>
          {ad.price ? (
            <p className="shrink-0 self-end font-semibold text-foreground">{ad.price}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function SponsoredAdCard({ ad, variant = 'default' }: SponsoredAdCardProps) {
  const cardClasses = `block h-full rounded-3xl border-border/70 bg-background shadow-sm transition-colors hover:bg-muted/40 ${
    variant === 'featured' ? 'p-5' : 'p-4'
  }`

  if (!ad.href) {
    return (
      <Card className={cardClasses}>
        <CardContent className="flex h-full flex-col p-0">
          <CardBody ad={ad} variant={variant} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Link to={ad.href} className={cardClasses}>
      <div className="flex h-full flex-col">
        <CardBody ad={ad} variant={variant} />
      </div>
    </Link>
  )
}
