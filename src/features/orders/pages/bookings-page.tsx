import { useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { PaginationControls } from '@/components/shared/pagination-controls'
import { BookingListCard } from '@/features/orders/components/booking-list-card'
import { useMyBookingsQuery } from '@/features/orders/hooks/use-my-bookings-query'
import { getApiErrorMessage } from '@/lib/api/api-error'

export function BookingsPage() {
  const [page, setPage] = useState(1)
  const bookingsQuery = useMyBookingsQuery(page)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-12">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Account</p>
        <h1 className="font-heading text-3xl font-semibold text-foreground">My bookings</h1>
      </div>

      {bookingsQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading bookings...</p> : null}
      {bookingsQuery.isError ? (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(bookingsQuery.error, 'Unable to load your bookings right now.')}
          </CardContent>
        </Card>
      ) : null}

      {bookingsQuery.data ? (
        <>
          <div className="space-y-4">
            {bookingsQuery.data.data.length ? (
              bookingsQuery.data.data.map((booking) => <BookingListCard key={booking.id} booking={booking} />)
            ) : (
              <Card>
                <CardContent className="py-6 text-sm text-muted-foreground">No bookings yet.</CardContent>
              </Card>
            )}
          </div>

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
