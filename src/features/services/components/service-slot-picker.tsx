import { useMemo } from 'react'

import { Input } from '@/components/ui/input'
import { BookingDatePicker } from '@/features/services/components/booking-date-picker'
import type { ServiceAvailabilitySlot } from '@/features/services/types/service.types'
import { cn } from '@/lib/utils'

interface SlotGroup {
  label: string
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
  onDateChange: (value: string) => void
  onTimezoneChange: (value: string) => void
  onSlotSelect: (slot: ServiceAvailabilitySlot) => void
}

function formatSelectedDate(date: string) {
  if (!date) {
    return ''
  }

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

function getTimeParts(dateTime: string, timezone: string) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
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

export function formatSlotTimeRange(slot: ServiceAvailabilitySlot, timezone: string) {
  const start = getTimeParts(slot.starts_at, timezone).label
  const end = getTimeParts(slot.ends_at, timezone).label

  return `${start} - ${end}`
}

export function formatSlotSummary(slot: ServiceAvailabilitySlot, timezone: string) {
  const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: timezone,
  })

  return `${dateFormatter.format(new Date(slot.starts_at))}, ${formatSlotTimeRange(slot, timezone)}`
}

function getSlotGroupLabel(hour: number) {
  if (hour < 12) {
    return 'Morning'
  }

  if (hour < 17) {
    return 'Afternoon'
  }

  return 'Evening'
}

function groupSlots(slots: ServiceAvailabilitySlot[], timezone: string): SlotGroup[] {
  const grouped = new Map<string, ServiceAvailabilitySlot[]>()

  for (const slot of slots) {
    const label = getSlotGroupLabel(getTimeParts(slot.starts_at, timezone).hour)
    const existing = grouped.get(label) ?? []
    existing.push(slot)
    grouped.set(label, existing)
  }

  return ['Morning', 'Afternoon', 'Evening']
    .map((label) => ({ label, slots: grouped.get(label) ?? [] }))
    .filter((group) => group.slots.length > 0)
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
  emptyMessage = 'No slots available for this date.',
  onDateChange,
  onTimezoneChange,
  onSlotSelect,
}: ServiceSlotPickerProps) {
  const groupedSlots = useMemo(() => groupSlots(slots, timezone), [slots, timezone])

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Date</label>
          <p className="text-sm text-muted-foreground">
            {date ? formatSelectedDate(date) : 'Choose a day to see available booking slots.'}
          </p>
        </div>
        <BookingDatePicker value={date} minDate={minDate} onChange={onDateChange} disabled={disabled} />
      </div>

      <div className="space-y-2">
        <label htmlFor="service-booking-timezone" className="text-sm font-medium text-foreground">
          Timezone
        </label>
        <Input
          id="service-booking-timezone"
          value={timezone}
          onChange={(event) => onTimezoneChange(event.target.value)}
          disabled={disabled}
        />
      </div>

      {selectedSlot ? (
        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="text-sm font-medium text-foreground">Selected booking</p>
          <p className="mt-1 text-sm text-muted-foreground">{formatSlotSummary(selectedSlot, timezone)}</p>
          {selectedSlot.remaining_capacity > 1 ? (
            <p className="mt-1 text-xs text-muted-foreground">Remaining capacity: {selectedSlot.remaining_capacity}</p>
          ) : null}
        </div>
      ) : null}

      {date && isLoading ? <p className="text-sm text-muted-foreground">Loading available slots...</p> : null}
      {date && errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

      {date && !isLoading && !errorMessage ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Available slots</p>
            <p className="text-sm text-muted-foreground">Choose one time slot for this booking.</p>
          </div>

          {groupedSlots.length ? (
            <div className="space-y-4">
              {groupedSlots.map((group) => (
                <div key={group.label} className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{group.label}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {group.slots.map((slot) => {
                      const isSelected =
                        selectedSlot?.starts_at === slot.starts_at && selectedSlot?.ends_at === slot.ends_at

                      return (
                        <button
                          key={`${slot.starts_at}-${slot.ends_at}`}
                          type="button"
                          onClick={() => onSlotSelect(slot)}
                          className={cn(
                            'rounded-xl border px-4 py-3 text-left transition-colors',
                            isSelected
                              ? 'border-foreground bg-foreground text-background'
                              : 'border-border bg-background hover:border-foreground/40 hover:bg-muted/40',
                          )}
                        >
                          <p className="text-sm font-medium">{formatSlotTimeRange(slot, timezone)}</p>
                          <p className={cn('mt-1 text-xs', isSelected ? 'text-background/80' : 'text-muted-foreground')}>
                            {slot.remaining_capacity > 1 ? `${slot.remaining_capacity} spots left` : '1 spot left'}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
