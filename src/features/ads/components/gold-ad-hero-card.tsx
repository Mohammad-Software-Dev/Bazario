import { SponsoredAdCard } from '@/features/ads/components/sponsored-ad-card'
import type { AdViewModel } from '@/features/ads/types/ad.types'

interface GoldAdHeroCardProps {
  ad: AdViewModel
}

export function GoldAdHeroCard({ ad }: GoldAdHeroCardProps) {
  return <SponsoredAdCard ad={ad} variant="featured" />
}
