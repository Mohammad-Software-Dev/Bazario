import { useState } from 'react'

import { MarketplaceUpdateCard } from '@/features/listings/components/marketplace-update-card'
import type { ListingRecord } from '@/features/listings/types/listing.types'

interface MarketplaceUpdatesCarouselProps {
  listings: ListingRecord[]
}

export function MarketplaceUpdatesCarousel({ listings }: MarketplaceUpdatesCarouselProps) {
  const [isPaused, setIsPaused] = useState(false)

  if (!listings.length) {
    return null
  }

  const repeatedListings = listings.length > 1 ? [...listings, ...listings] : listings

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <style>{`
        @keyframes bazarioMarketplaceUpdatesMarquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>

      <div
        className="flex w-max gap-4"
        style={
          listings.length > 1
            ? {
                animation: 'bazarioMarketplaceUpdatesMarquee 28s linear infinite',
                animationPlayState: isPaused ? 'paused' : 'running',
              }
            : undefined
        }
      >
        {repeatedListings.map((listing, index) => (
          <div key={`${listing.id}-${index}`} className="w-[280px] shrink-0 md:w-[340px] lg:w-[380px]">
            <MarketplaceUpdateCard listing={listing} />
          </div>
        ))}
      </div>
    </div>
  )
}
