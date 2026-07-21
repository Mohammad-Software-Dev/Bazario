import { cn } from '@/lib/utils'

import type { BookingStatus, OrderItemStatus, OrderStatus } from '@/features/orders/types/order.types'

interface OrderStatusBadgeProps {
  status: BookingStatus | OrderItemStatus | OrderStatus | string
}

const statusClassNames: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  requires_payment: 'bg-amber-100 text-amber-900',
  paid: 'bg-emerald-100 text-emerald-900',
  partially_refunded: 'bg-orange-100 text-orange-900',
  refunded: 'bg-stone-200 text-stone-900',
  pending: 'bg-muted text-muted-foreground',
  fulfilled: 'bg-emerald-100 text-emerald-900',
  cancelled: 'bg-stone-200 text-stone-900',
  requested: 'bg-sky-100 text-sky-900',
  confirmed: 'bg-emerald-100 text-emerald-900',
  in_progress: 'bg-indigo-100 text-indigo-900',
  completed: 'bg-emerald-100 text-emerald-900',
  cancelled_by_customer: 'bg-stone-200 text-stone-900',
  cancelled_by_provider: 'bg-stone-200 text-stone-900',
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize',
        statusClassNames[status] ?? 'bg-muted text-muted-foreground',
      )}
    >
      {status.replaceAll('_', ' ')}
    </span>
  )
}
