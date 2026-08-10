import { useTranslation } from 'react-i18next'

import { getListingImageUrl } from '@/features/listings/lib/listing-mappers'
import type { ListingRecord } from '@/features/listings/types/listing.types'

interface MarketplaceUpdateCardProps {
  listing: ListingRecord
}

export function MarketplaceUpdateCard({ listing }: MarketplaceUpdateCardProps) {
  const { t } = useTranslation()
  const imageUrl = getListingImageUrl(listing)

  return (
    <article className="group relative aspect-[16/9] overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-sm">
      {imageUrl ? (
        <img src={imageUrl} alt={listing.title} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
          {t('common.noImage')}
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/72 via-black/14 to-black/18" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
        <span className="inline-flex max-w-[70%] truncate rounded-full bg-background/88 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
          {listing.user?.name ?? t('common.account')}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="space-y-2">
          <p className="text-base font-semibold leading-6 text-white md:text-lg">{listing.title}</p>
          {listing.description ? (
            <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:max-h-24 group-hover:opacity-100">
              <p className="text-sm leading-5 text-white/88 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                {listing.description}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}
