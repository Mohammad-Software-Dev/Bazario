import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PaginationControls } from '@/components/shared/pagination-controls'
import { OrderListCard } from '@/features/orders/components/order-list-card'
import { useMyOrdersQuery } from '@/features/orders/hooks/use-my-orders-query'
import { getApiErrorMessage } from '@/lib/api/api-error'

export function OrdersPage() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const ordersQuery = useMyOrdersQuery(page)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t('orders.pageEyebrow')}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {t('orders.pageTitle')}
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {t('orders.pageDescription')}
        </p>
      </div>

      {ordersQuery.isLoading ? <p className="text-sm text-muted-foreground">{t('orders.loadingOrders')}</p> : null}
      {ordersQuery.isError ? (
        <Card className="border-border/70 shadow-sm">
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(ordersQuery.error, t('orders.loadOrdersError'))}
          </CardContent>
        </Card>
      ) : null}

      {ordersQuery.data ? (
        <>
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="gap-3 border-b border-border/70 pb-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                  <CardTitle>{t('orders.orderHistory')}</CardTitle>
                  <CardDescription>
                    {t('orders.orderHistoryDescription')}
                  </CardDescription>
                </div>
                <div className="rounded-full border border-border/70 bg-muted/40 px-4 py-2">
                  <p className="text-sm font-medium text-foreground">
                    {t('orders.totalOrders', { count: ordersQuery.data.total })}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-6">
              {ordersQuery.data.data.length ? (
                <div className="space-y-3">
                  {ordersQuery.data.data.map((order) => (
                    <OrderListCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border/80 p-8 text-sm text-muted-foreground">
                  {t('orders.noOrders')}
                </div>
              )}
            </CardContent>
          </Card>

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
