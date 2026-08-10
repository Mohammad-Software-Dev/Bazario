import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

import { SponsoredAdCard } from "@/features/ads/components/sponsored-ad-card"
import type { AdViewModel } from "@/features/ads/types/ad.types"

interface SponsoredAdsCarouselProps {
  ads: AdViewModel[]
  variant?: "default" | "compact" | "featured"
  itemClassName?: string
}

export function SponsoredAdsCarousel({
  ads,
  variant = "default",
  itemClassName = "basis-[86%] md:basis-[46%]",
}: SponsoredAdsCarouselProps) {
  const autoplay = React.useRef(
    Autoplay({
      delay: 4500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  )

  return (
    <Carousel
      opts={{ align: "start", loop: ads.length > 1 }}
      plugins={ads.length > 1 ? [autoplay.current] : []}
      className="w-full"
    >
      <CarouselContent className="items-stretch">
        {ads.map((ad) => (
          <CarouselItem key={ad.id} className={`${itemClassName} h-full`}>
            <SponsoredAdCard ad={ad} variant={variant} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
