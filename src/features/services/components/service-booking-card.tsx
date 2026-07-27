import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ServiceSlotPicker } from '@/features/services/components/service-slot-picker'
import { useCartActions } from '@/features/cart/hooks/use-cart'
import { useServiceAvailabilityQuery } from '@/features/services/hooks/use-service-availability-query'
import type { ServiceAvailabilitySlot, ServiceListItem } from '@/features/services/types/service.types'
import { getApiErrorMessage } from '@/lib/api/api-error'
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

export function ServiceBookingCard({ service }: ServiceBookingCardProps) {
  const { addServiceItem } = useCartActions()
  const [date, setDate] = useState('')
  const [timezone, setTimezone] = useState(getInitialTimezone)
  const [selectedSlot, setSelectedSlot] = useState<ServiceAvailabilitySlot | null>(null)
  const [isAdded, setIsAdded] = useState(false)

  const availabilityQuery = useServiceAvailabilityQuery({ serviceId: service.id, date, timezone })
  const minimumDate = useMemo(() => getMinimumDate(), [])
  const isBookable = Boolean(service.is_active)

  function handleSelectDate(value: string) {
    setDate(value)
    setSelectedSlot(null)
    setIsAdded(false)
  }

  function handleSelectTimezone(value: string) {
    setTimezone(value)
    setSelectedSlot(null)
    setIsAdded(false)
  }

  function handleSelectSlot(slot: ServiceAvailabilitySlot) {
    setSelectedSlot(slot)
    setIsAdded(false)
  }

  function handleAddToCart() {
    if (!selectedSlot) {
      return
    }

    addServiceItem({
      service_id: service.id,
      title: getLocalizedValue(service.title) || 'Untitled service',
      image: service.images[0]?.image ?? null,
      price: service.price,
      provider_name: (service.service_provider ?? service.serviceProvider)?.name ?? 'Independent provider',
      category_name: getLocalizedValue(service.category?.name) || undefined,
      duration_minutes: service.duration_minutes ?? null,
      starts_at: selectedSlot.starts_at,
      ends_at: selectedSlot.ends_at,
      timezone,
      location_type: service.location_type ?? '',
      location_payload: null,
    })

    setIsAdded(true)
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
          selectedSlot={selectedSlot}
          slots={availabilityQuery.data?.slots ?? []}
          disabled={!isBookable}
          isLoading={availabilityQuery.isLoading}
          errorMessage={
            availabilityQuery.isError
              ? getApiErrorMessage(availabilityQuery.error, 'Unable to load available slots right now.')
              : null
          }
          onDateChange={handleSelectDate}
          onTimezoneChange={handleSelectTimezone}
          onSlotSelect={handleSelectSlot}
        />

        <Button onClick={handleAddToCart} disabled={!selectedSlot || !isBookable} className="w-full">
          Add booking to cart
        </Button>

        {isAdded ? <p className="text-sm text-emerald-700">Booking added to cart.</p> : null}
        {service.location_type ? <p className="text-sm text-muted-foreground">Location type: {service.location_type}</p> : null}
      </CardContent>
    </Card>
  )
}
