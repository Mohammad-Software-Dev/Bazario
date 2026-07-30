import { useState } from 'react'

import { PaginationControls } from '@/components/shared/pagination-controls'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProviderBookingCard } from '@/features/orders/components/provider-booking-card'
import { useProviderBookingsQuery } from '@/features/orders/hooks/use-provider-bookings-query'
import { getApiErrorMessage } from '@/lib/api/api-error'

export function ProviderBookingsPage() {
  const [page, setPage] = useState(1)
  const bookingsQuery = useProviderBookingsQuery(page)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Provider workspace
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Customer bookings</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Review upcoming service bookings, confirm new requests, and mark completed work.
        </p>
      </div>

      {bookingsQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading bookings...</p>
      ) : null}
      {bookingsQuery.isError ? (
        <Card className="border-border/70 shadow-sm">
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(bookingsQuery.error, 'Unable to load provider bookings right now.')}
          </CardContent>
        </Card>
      ) : null}

      {bookingsQuery.data ? (
        <>
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="gap-3 border-b border-border/70 pb-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                  <CardTitle>Bookings queue</CardTitle>
                  <CardDescription>
                    Keep track of requests, confirmed appointments, and completed bookings.
                  </CardDescription>
                </div>
                <div className="rounded-full bg-slate-50 px-4 py-2 ring-1 ring-slate-200">
                  <p className="text-sm font-medium text-slate-700">
                    Total bookings:{' '}
                    <span className="font-semibold text-foreground">{bookingsQuery.data.total}</span>
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-6">
              {bookingsQuery.data.data.length ? (
                <div className="space-y-3">
                  {bookingsQuery.data.data.map((booking) => (
                    <ProviderBookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border/80 p-8 text-sm text-muted-foreground">
                  No customer bookings yet.
                </div>
              )}
            </CardContent>
          </Card>

          <PaginationControls
            currentPage={bookingsQuery.data.current_page}
            lastPage={bookingsQuery.data.last_page}
            onPageChange={setPage}
          />
        </>
      ) : null}
    </div>
  )
}
