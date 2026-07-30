import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ServiceSlotPicker } from '@/features/services/components/service-slot-picker'
import { useServiceAvailabilityQuery } from '@/features/services/hooks/use-service-availability-query'
import type { ServiceAvailabilitySlot } from '@/features/services/types/service.types'
import { useBookingQuery } from '@/features/orders/hooks/use-booking-query'
import { useRescheduleBookingMutation } from '@/features/orders/hooks/use-reschedule-booking-mutation'
import {
  formatBookingCutoff,
  formatBookingWindow,
  getBookingLocalDateValue,
  getBookingPrimaryProviderName,
  getBookingServiceTitle,
  isSameBookingWindow,
} from '@/features/orders/lib/order-format'
import { getApiErrorMessage } from '@/lib/api/api-error'

function parseBookingId(value: string | undefined) {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 1) {
    return null
  }

  return parsed
}

function getInitialTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

function getMinimumDate() {
  return new Date().toISOString().slice(0, 10)
}

export function BookingReschedulePage() {
  const { bookingId: bookingIdParam } = useParams()
  const bookingId = parseBookingId(bookingIdParam)
  const navigate = useNavigate()
  const bookingQuery = useBookingQuery(bookingId ?? 0, Boolean(bookingId))
  const rescheduleBookingMutation = useRescheduleBookingMutation()
  const [dateOverride, setDateOverride] = useState<string | null>(null)
  const [timezoneOverride, setTimezoneOverride] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<ServiceAvailabilitySlot | null>(null)

  const booking = bookingQuery.data
  const minimumDate = useMemo(() => getMinimumDate(), [])
  const date = booking ? dateOverride ?? getBookingLocalDateValue(booking) : ''
  const timezone = timezoneOverride ?? booking?.timezone ?? getInitialTimezone()
  const availabilityQuery = useServiceAvailabilityQuery({
    serviceId: booking?.service.id ?? 0,
    date,
    timezone,
    ignoreBookingId: booking?.id,
    enabled: Boolean(booking?.actions.can_reschedule),
  })

  if (!bookingId) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-12">
        <Card>
          <CardContent className="py-6 text-sm text-destructive">Invalid booking id.</CardContent>
        </Card>
      </div>
    )
  }

  function handleDateChange(value: string) {
    setDateOverride(value)
    setSelectedSlot(null)
  }

  function handleTimezoneChange(value: string) {
    setTimezoneOverride(value)
    setSelectedSlot(null)
  }

  function handleReschedule() {
    if (!booking || !selectedSlot) {
      return
    }

    rescheduleBookingMutation.mutate(
      {
        bookingId: booking.id,
        payload: {
          starts_at: selectedSlot.starts_at,
          ends_at: selectedSlot.ends_at,
          timezone,
        },
      },
      {
        onSuccess: () => {
          navigate('/account/bookings')
        },
      },
    )
  }

  const isSameSlot = booking && selectedSlot ? isSameBookingWindow(booking, selectedSlot.starts_at, selectedSlot.ends_at) : false

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Account</p>
          <h1 className="font-heading text-3xl font-semibold text-foreground">Reschedule booking</h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/account/bookings">Back to bookings</Link>
        </Button>
      </div>

      {bookingQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading booking...</p> : null}
      {bookingQuery.isError ? (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(bookingQuery.error, 'Unable to load this booking right now.')}
          </CardContent>
        </Card>
      ) : null}

      {booking ? (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Service:</span> {getBookingServiceTitle(booking.service)}
                </p>
                <p>
                  <span className="font-medium text-foreground">Provider:</span> {getBookingPrimaryProviderName(booking)}
                </p>
                <p>
                  <span className="font-medium text-foreground">Current slot:</span>{' '}
                  {formatBookingWindow(booking.starts_at, booking.ends_at, booking.timezone)}
                </p>
                <p>
                  <span className="font-medium text-foreground">Timezone:</span> {booking.timezone ?? 'UTC'}
                </p>
                {booking.location_type ? (
                  <p>
                    <span className="font-medium text-foreground">Location:</span> {booking.location_type}
                  </p>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reschedule policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {booking.cutoffs.reschedule_deadline ? (
                  <p>Reschedule until: {formatBookingCutoff(booking.cutoffs.reschedule_deadline, booking.timezone)}</p>
                ) : (
                  <p>Rescheduling is allowed until the service starts.</p>
                )}
                {booking.actions.reschedule_block_reason ? <p>{booking.actions.reschedule_block_reason}</p> : null}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Choose a new slot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <ServiceSlotPicker
                date={date}
                timezone={timezone}
                minDate={minimumDate}
                selectedSlot={selectedSlot}
                slots={availabilityQuery.data?.slots ?? []}
                disabled={!booking.actions.can_reschedule || !(booking.service.is_active ?? true)}
                isLoading={availabilityQuery.isLoading}
                errorMessage={
                  availabilityQuery.isError
                    ? getApiErrorMessage(availabilityQuery.error, 'Unable to load available slots right now.')
                    : null
                }
                onDateChange={handleDateChange}
                onTimezoneChange={handleTimezoneChange}
                onSlotSelect={setSelectedSlot}
              />

              {rescheduleBookingMutation.isError ? (
                <p className="text-sm text-destructive">
                  {getApiErrorMessage(rescheduleBookingMutation.error, 'Unable to reschedule this booking right now.')}
                </p>
              ) : null}

              <Button
                onClick={handleReschedule}
                disabled={!selectedSlot || isSameSlot || rescheduleBookingMutation.isPending || !booking.actions.can_reschedule}
                className="w-full"
              >
                {rescheduleBookingMutation.isPending ? 'Saving...' : 'Save new booking time'}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
