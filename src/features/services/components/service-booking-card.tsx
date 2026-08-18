import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartActions, useCartItems } from '@/features/cart/hooks/use-cart'
import { ServiceSlotPicker } from '@/features/services/components/service-slot-picker'
import { useServiceAvailabilityQuery } from '@/features/services/hooks/use-service-availability-query'
import { getLocationTypeLabel } from '@/features/services/lib/location-type'
import type { ServiceAvailabilitySlot, ServiceListItem } from '@/features/services/types/service.types'
import { getApiErrorMessage } from '@/lib/api/api-error'
import { resolveMediaUrl } from '@/lib/api/asset-url'
import { useAuth } from '@/lib/auth/use-auth'
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
  const { t } = useTranslation()
  const { session } = useAuth()
  const { addServiceItem } = useCartActions()
  const cartItems = useCartItems()
  const [date, setDate] = useState('')
  const [timezone, setTimezone] = useState(getInitialTimezone)
  const [selectedSlot, setSelectedSlot] = useState<ServiceAvailabilitySlot | null>(null)

  const availabilityQuery = useServiceAvailabilityQuery({ serviceId: service.id, date, timezone })
  const minimumDate = useMemo(() => getMinimumDate(), [])
  const isBookable = Boolean(service.is_active)
  const isOwner =
    session?.user.id ===
    (service.service_provider?.user_id ?? service.serviceProvider?.user_id)

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
    if (!activeSelectedSlot || isOwner) {
      return
    }

    addServiceItem({
      service_id: service.id,
      title: getLocalizedValue(service.title) || t('common.untitledService'),
      image: resolveMediaUrl(service.images[0]?.image_url, service.images[0]?.image),
      price: service.price,
      provider_name: (service.service_provider ?? service.serviceProvider)?.name ?? t('serviceBooking.independentProvider'),
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
        <CardTitle>{t('serviceBooking.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {!isBookable ? (
          <p className="text-sm text-destructive">{t('serviceBooking.notBookable')}</p>
        ) : isOwner ? (
          <p className="text-sm text-muted-foreground">{t('serviceBooking.ownerBlocked')}</p>
        ) : null}

        <ServiceSlotPicker
          date={date}
          timezone={timezone}
          minDate={minimumDate}
          selectedSlot={activeSelectedSlot}
          slots={availabilityQuery.data?.slots ?? []}
          disabled={!isBookable || Boolean(isOwner)}
          isLoading={availabilityQuery.isLoading}
          errorMessage={
            availabilityQuery.isError
              ? getApiErrorMessage(availabilityQuery.error, t('serviceBooking.loadSlotsError'))
              : null
          }
          getSlotDisabledReason={(slot) =>
            isSlotBlockedByCart(slot) ? t('serviceBooking.conflictsWithCart') : null
          }
          onDateChange={handleSelectDate}
          onTimezoneChange={handleSelectTimezone}
          onSlotSelect={handleSelectSlot}
        />

        <Button
          onClick={handleAddToCart}
          disabled={!activeSelectedSlot || !isBookable || Boolean(isOwner)}
          className="w-full"
        >
          {t('serviceBooking.addToCart')}
        </Button>

        {conflictingCartBookings.length ? (
          <p className="text-sm text-muted-foreground">{t('serviceBooking.conflictHint')}</p>
        ) : null}

        {getLocationTypeLabel(service.location_type, t) ? (
          <p className="text-sm text-muted-foreground">
            {t('serviceBooking.locationTypeValue', {
              value: getLocationTypeLabel(service.location_type, t),
            })}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
