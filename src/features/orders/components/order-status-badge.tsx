import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import type { BookingStatus, OrderItemStatus, OrderStatus } from '@/features/orders/types/order.types'

interface OrderStatusBadgeProps {
  status: BookingStatus | OrderItemStatus | OrderStatus | string
}

const statusClassNames: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  requires_payment: 'bg-accent text-accent-foreground',
  paid: 'bg-primary/12 text-primary',
  partially_refunded: 'bg-secondary/20 text-secondary-foreground',
  refunded: 'bg-muted text-foreground',
  pending: 'bg-muted text-muted-foreground',
  fulfilled: 'bg-primary/12 text-primary',
  cancelled: 'bg-muted text-foreground',
  requested: 'bg-secondary/20 text-secondary-foreground',
  confirmed: 'bg-primary/12 text-primary',
  in_progress: 'bg-secondary/20 text-secondary-foreground',
  completed: 'bg-primary/12 text-primary',
  cancelled_by_customer: 'bg-muted text-foreground',
  cancelled_by_provider: 'bg-muted text-foreground',
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { t } = useTranslation()
  const label = t(`statuses.${status}`, { defaultValue: status.replaceAll('_', ' ') })

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize',
        statusClassNames[status] ?? 'bg-muted text-muted-foreground',
      )}
    >
      {label}
    </span>
  )
}
