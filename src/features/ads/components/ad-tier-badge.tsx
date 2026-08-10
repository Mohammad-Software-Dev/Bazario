import { useTranslation } from 'react-i18next'

import type { AdTier } from '@/features/ads/types/ad.types'

interface AdTierBadgeProps {
  tier: AdTier
}

const toneClasses: Record<AdTier, string> = {
  gold: 'bg-amber-100 text-amber-800',
  silver: 'bg-slate-100 text-slate-700',
  normal: 'bg-zinc-100 text-zinc-700',
}

export function AdTierBadge({ tier }: AdTierBadgeProps) {
  const { t } = useTranslation()

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tier]}`}>
      {t(`ads.tiers.${tier}`)}
    </span>
  )
}
