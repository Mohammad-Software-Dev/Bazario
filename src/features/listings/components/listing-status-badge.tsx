import { useTranslation } from 'react-i18next'

import { normalizeListingStatus, type ListingStatus } from '@/features/listings/types/listing.types'

interface ListingStatusBadgeProps {
  status?: ListingStatus | null
}

function statusTone(status: ListingStatus) {
  switch (status) {
    case 'pending_payment':
      return 'bg-secondary/20 text-secondary-foreground'
    case 'pending_review':
      return 'bg-accent text-accent-foreground'
    case 'approved':
      return 'bg-primary/12 text-primary'
    case 'rejected':
      return 'bg-destructive/10 text-destructive'
    default:
      return 'bg-accent text-accent-foreground'
  }
}

export function ListingStatusBadge({ status }: ListingStatusBadgeProps) {
  const { t } = useTranslation()
  const normalizedStatus = normalizeListingStatus(status)

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusTone(normalizedStatus)}`}>
      {t(`listings.status.${normalizedStatus}`)}
    </span>
  )
}
