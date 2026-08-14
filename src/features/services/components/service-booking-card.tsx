import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartActions, useCartItems } from '@/features/cart/hooks/use-cart'
import { ServiceSlotPicker } from '@/features/services/components/service-slot-picker'
import { useServiceAvailabilityQuery } from '@/features/services/hooks/use-service-availability-query'
import type { ServiceAvailabilitySlot, ServiceListItem } from '@/features/services/types/service.types'
import { getApiErrorMessage } from '@/lib/api/api-error'
import { resolveMediaUrl } from '@/lib/api/asset-url'
import { getLocalizedValue } from '@/lib/localized-value'

interface ServiceBookingCardProps {
  service: ServiceListItem
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

function isSlotOverlapping(
  slot: Pick<ServiceAvailabilitySlot, 'starts_at' | 'ends_at'>,
  cartItem: { starts_at: string; ends_at: string },
) {
  return slot.starts_at < cartItem.ends_at && slot.ends_at > cartItem.starts_at
}

export function ServiceBookingCard({ service }: ServiceBookingCardProps) {
  const { addServiceItem } = useCartActions()
  const cartItems = useCartItems()
  const [date, setDate] = useState('')
  const [timezone, setTimezone] = useState(getInitialTimezone)
  const [selectedSlot, setSelectedSlot] = useState<ServiceAvailabilitySlot | null>(null)

  const availabilityQuery = useServiceAvailabilityQuery({ serviceId: service.id, date, timezone })
  const minimumDate = useMemo(() => getMinimumDate(), [])
  const isBookable = Boolean(service.is_active)

  const conflictingCartBookings = useMemo(
    () =>
      cartItems.filter(
        (item): item is Extract<(typeof cartItems)[number], { type: 'service' }> =>
          item.type === 'service' &&
          item.service_id === service.id &&
          item.timezone === timezone &&
          (!date || item.starts_at.slice(0, 10) === date),
      ),
    [cartItems, date, service.id, timezone],
  )

  const isSlotBlockedByCart = (slot: ServiceAvailabilitySlot) =>
    conflictingCartBookings.some((item) => isSlotOverlapping(slot, item))

  function handleSelectDate(value: string) {
    setDate(value)
    setSelectedSlot(null)
  }

  function handleSelectTimezone(value: string) {
    setTimezone(value)
    setSelectedSlot(null)
  }

  function handleSelectSlot(slot: ServiceAvailabilitySlot) {
    setSelectedSlot(slot)
  }

  const activeSelectedSlot = selectedSlot && !isSlotBlockedByCart(selectedSlot) ? selectedSlot : null

  function handleAddToCart() {
    if (!activeSelectedSlot) {
      return
    }

    addServiceItem({
      service_id: service.id,
      title: getLocalizedValue(service.title) || 'Untitled service',
      image: resolveMediaUrl(service.images[0]?.image_url, service.images[0]?.image),
      price: service.price,
      provider_name: (service.service_provider ?? service.serviceProvider)?.name ?? 'Independent provider',
      category_name: getLocalizedValue(service.category?.name) || undefined,
      duration_minutes: service.duration_minutes ?? null,
      starts_at: activeSelectedSlot.starts_at,
      ends_at: activeSelectedSlot.ends_at,
      timezone,
      location_type: service.location_type ?? '',
      location_payload: null,
    })

    setSelectedSlot(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book and add to cart</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {!isBookable ? <p className="text-sm text-destructive">This service is not currently bookable.</p> : null}

        <ServiceSlotPicker
          date={date}
          timezone={timezone}
          minDate={minimumDate}
          selectedSlot={activeSelectedSlot}
          slots={availabilityQuery.data?.slots ?? []}
          disabled={!isBookable}
          isLoading={availabilityQuery.isLoading}
          errorMessage={
            availabilityQuery.isError
              ? getApiErrorMessage(availabilityQuery.error, 'Unable to load available slots right now.')
              : null
          }
          getSlotDisabledReason={(slot) =>
            isSlotBlockedByCart(slot) ? 'Conflicts with a booking already in your cart.' : null
          }
          onDateChange={handleSelectDate}
          onTimezoneChange={handleSelectTimezone}
          onSlotSelect={handleSelectSlot}
        />

        <Button
          onClick={handleAddToCart}
          disabled={!activeSelectedSlot || !isBookable}
          className="w-full"
        >
          Add booking to cart
        </Button>

        {conflictingCartBookings.length ? (
          <p className="text-sm text-muted-foreground">
            Slots that overlap with this service already in your cart are disabled until you remove or change that
            booking.
          </p>
        ) : null}

        {service.location_type ? <p className="text-sm text-muted-foreground">Location type: {service.location_type}</p> : null}
      </CardContent>
    </Card>
  )
}
