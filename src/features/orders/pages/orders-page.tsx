import { useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { PaginationControls } from '@/components/shared/pagination-controls'
import { OrderListCard } from '@/features/orders/components/order-list-card'
import { useMyOrdersQuery } from '@/features/orders/hooks/use-my-orders-query'
import { getApiErrorMessage } from '@/lib/api/api-error'

export function OrdersPage() {
  const [page, setPage] = useState(1)
  const ordersQuery = useMyOrdersQuery(page)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-12">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Account</p>
        <h1 className="font-heading text-3xl font-semibold text-foreground">My orders</h1>
      </div>

      {ordersQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading orders...</p> : null}
      {ordersQuery.isError ? (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(ordersQuery.error, 'Unable to load your orders right now.')}
          </CardContent>
        </Card>
      ) : null}

      {ordersQuery.data ? (
        <>
          <div className="space-y-4">
            {ordersQuery.data.data.length ? (
              ordersQuery.data.data.map((order) => <OrderListCard key={order.id} order={order} />)
            ) : (
              <Card>
                <CardContent className="py-6 text-sm text-muted-foreground">No orders yet.</CardContent>
              </Card>
            )}
          </div>

          <PaginationControls
            currentPage={ordersQuery.data.current_page}
            lastPage={ordersQuery.data.last_page}
            onPageChange={setPage}
          />
        </>
      ) : null}
    </div>
  )
}
