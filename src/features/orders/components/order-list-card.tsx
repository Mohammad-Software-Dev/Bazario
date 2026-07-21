import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatOrderDate, formatOrderMoney, getOrderPrimaryDate } from '@/features/orders/lib/order-format'
import type { OrderRecord } from '@/features/orders/types/order.types'
import { OrderStatusBadge } from '@/features/orders/components/order-status-badge'

interface OrderListCardProps {
  order: OrderRecord
}

export function OrderListCard({ order }: OrderListCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>Order #{order.id}</CardTitle>
          <p className="text-sm text-muted-foreground">{formatOrderDate(getOrderPrimaryDate(order))}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-1 text-muted-foreground">
          <p>{order.items.length} items</p>
          <p>{formatOrderMoney(order.total_amount, order.currency_iso)}</p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/account/orders/${order.id}`}>View order</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
