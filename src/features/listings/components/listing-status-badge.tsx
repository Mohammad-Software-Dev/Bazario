import { useTranslation } from 'react-i18next'

import { normalizeListingStatus, type ListingStatus } from '@/features/listings/types/listing.types'

interface ListingStatusBadgeProps {
  status?: ListingStatus | null
}

function statusTone(status: ListingStatus) {
  switch (status) {
    case 'pending_payment':
      return 'bg-sky-100 text-sky-700'
    case 'pending_review':
      return 'bg-amber-100 text-amber-700'
    case 'approved':
      return 'bg-emerald-100 text-emerald-700'
    case 'rejected':
      return 'bg-rose-100 text-rose-700'
    default:
      return 'bg-amber-100 text-amber-700'
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
