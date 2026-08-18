import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Input } from '@/components/ui/input'
import { BookingDatePicker } from '@/features/services/components/booking-date-picker'
import type { ServiceAvailabilitySlot } from '@/features/services/types/service.types'
import { formatDateTime, getIntlLocale } from '@/lib/i18n/format'
import { cn } from '@/lib/utils'

interface SlotGroup {
  label: 'morning' | 'afternoon' | 'evening'
  slots: ServiceAvailabilitySlot[]
}

interface ServiceSlotPickerProps {
  date: string
  timezone: string
  minDate: string
  selectedSlot: ServiceAvailabilitySlot | null
  slots: ServiceAvailabilitySlot[]
  disabled?: boolean
  isLoading?: boolean
  errorMessage?: string | null
  emptyMessage?: string
  getSlotDisabledReason?: (slot: ServiceAvailabilitySlot) => string | null
  onDateChange: (value: string) => void
  onTimezoneChange: (value: string) => void
  onSlotSelect: (slot: ServiceAvailabilitySlot) => void
}

function formatSelectedDate(date: string) {
  if (!date) {
    return ''
  }

  return formatDateTime(new Date(`${date}T00:00:00`), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getTimeParts(dateTime: string, timezone: string) {
  const formatter = new Intl.DateTimeFormat(getIntlLocale(), {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: timezone,
  })

  const parts = formatter.formatToParts(new Date(dateTime))
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0')
  const minute = parts.find((part) => part.type === 'minute')?.value ?? '00'

  return {
    hour,
    label: `${String(hour).padStart(2, '0')}:${minute}`,
  }
}

function formatSlotTimeRange(slot: ServiceAvailabilitySlot, timezone: string) {
  const start = getTimeParts(slot.starts_at, timezone).label
  const end = getTimeParts(slot.ends_at, timezone).label

  return `${start} - ${end}`
}

function formatSlotSummary(slot: ServiceAvailabilitySlot, timezone: string) {
  return `${formatDateTime(slot.starts_at, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: timezone,
  })}, ${formatSlotTimeRange(slot, timezone)}`
}

function getSlotGroupLabel(hour: number): SlotGroup['label'] {
  if (hour < 12) {
    return 'morning'
  }

  if (hour < 17) {
    return 'afternoon'
  }

  return 'evening'
}

function groupSlots(slots: ServiceAvailabilitySlot[], timezone: string): SlotGroup[] {
  const grouped = new Map<SlotGroup['label'], ServiceAvailabilitySlot[]>()

  for (const slot of slots) {
    const label = getSlotGroupLabel(getTimeParts(slot.starts_at, timezone).hour)
    const existing = grouped.get(label) ?? []
    existing.push(slot)
    grouped.set(label, existing)
  }

  return ['morning', 'afternoon', 'evening']
    .map((label) => ({ label, slots: grouped.get(label as SlotGroup['label']) ?? [] }))
    .filter((group) => group.slots.length > 0) as SlotGroup[]
}

export function ServiceSlotPicker({
  date,
  timezone,
  minDate,
  selectedSlot,
  slots,
  disabled = false,
  isLoading = false,
  errorMessage = null,
  emptyMessage,
  getSlotDisabledReason,
  onDateChange,
  onTimezoneChange,
  onSlotSelect,
}: ServiceSlotPickerProps) {
  const { t } = useTranslation()
  const groupedSlots = useMemo(() => groupSlots(slots, timezone), [slots, timezone])
  const resolvedEmptyMessage = emptyMessage ?? t('slotPicker.noSlotsForDate')

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">{t('slotPicker.date')}</label>
          <p className="text-sm text-muted-foreground">{date ? formatSelectedDate(date) : t('slotPicker.chooseDate')}</p>
        </div>
        <BookingDatePicker value={date} minDate={minDate} onChange={onDateChange} disabled={disabled} />
      </div>

      <div className="space-y-2">
        <label htmlFor="service-booking-timezone" className="text-sm font-medium text-foreground">
          {t('slotPicker.timezone')}
        </label>
        <Input id="service-booking-timezone" value={timezone} onChange={(event) => onTimezoneChange(event.target.value)} disabled={disabled} />
      </div>

      {selectedSlot ? (
        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="text-sm font-medium text-foreground">{t('slotPicker.selectedBooking')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{formatSlotSummary(selectedSlot, timezone)}</p>
          {selectedSlot.remaining_capacity > 1 ? (
            <p className="mt-1 text-xs text-muted-foreground">{t('slotPicker.remainingCapacity', { count: selectedSlot.remaining_capacity })}</p>
          ) : null}
        </div>
      ) : null}

      {date && isLoading ? <p className="text-sm text-muted-foreground">{t('slotPicker.loadingSlots')}</p> : null}
      {date && errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

      {date && !isLoading && !errorMessage ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{t('slotPicker.availableSlots')}</p>
            <p className="text-sm text-muted-foreground">{t('slotPicker.chooseOneSlot')}</p>
          </div>

          {groupedSlots.length ? (
            <div className="space-y-4">
              {groupedSlots.map((group) => (
                <div key={group.label} className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t(`slotPicker.${group.label}`)}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {group.slots.map((slot) => {
                      const isSelected = selectedSlot?.starts_at === slot.starts_at && selectedSlot?.ends_at === slot.ends_at
                      const disabledReason = disabled ? t('slotPicker.bookingUnavailable') : getSlotDisabledReason?.(slot) ?? null
                      const isSlotDisabled = Boolean(disabledReason)

                      return (
                        <button
                          key={`${slot.starts_at}-${slot.ends_at}`}
                          type="button"
                          onClick={() => onSlotSelect(slot)}
                          disabled={isSlotDisabled}
                          className={cn(
                            'rounded-xl border px-4 py-3 text-start transition-colors',
                            isSelected ? 'border-foreground bg-foreground text-background' : 'border-border bg-background hover:border-foreground/40 hover:bg-muted/40',
                            isSlotDisabled && 'cursor-not-allowed border-dashed border-muted-foreground/30 bg-muted/20 text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/20',
                          )}
                        >
                          <p className="text-sm font-medium">{formatSlotTimeRange(slot, timezone)}</p>
                          <p className={cn('mt-1 text-xs', isSelected ? 'text-background/80' : 'text-muted-foreground')}>
                            {slot.remaining_capacity > 1 ? t('slotPicker.spotsLeft', { count: slot.remaining_capacity }) : t('slotPicker.oneSpotLeft')}
                          </p>
                          {disabledReason ? <p className="mt-2 text-xs text-muted-foreground">{disabledReason}</p> : null}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{resolvedEmptyMessage}</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
