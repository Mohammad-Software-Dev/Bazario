import { useTranslation } from 'react-i18next'

import type { AdTier } from '@/features/ads/types/ad.types'

interface AdTierBadgeProps {
  tier: AdTier
}

const toneClasses: Record<AdTier, string> = {
  gold: 'bg-secondary/20 text-secondary-foreground',
  silver: 'bg-muted text-muted-foreground',
  normal: 'bg-accent text-accent-foreground',
}

export function AdTierBadge({ tier }: AdTierBadgeProps) {
  const { t } = useTranslation()

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tier]}`}>
      {t(`ads.tiers.${tier}`)}
    </span>
  )
}
