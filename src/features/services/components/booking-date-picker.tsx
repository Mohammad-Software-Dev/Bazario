import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/i18n/format'
import { cn } from '@/lib/utils'

interface BookingDatePickerProps {
  disabled?: boolean
  minDate: string
  onChange: (value: string) => void
  value: string
}

function parseDateParts(value: string) {
  const [year, month, day] = value.split('-').map(Number)

  return { year, month, day }
}

function formatDateValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function buildMonthLabel(year: number, monthIndex: number) {
  return formatDateTime(new Date(year, monthIndex, 1), {
    month: 'long',
    year: 'numeric',
  })
}

function buildCalendarDays(year: number, monthIndex: number) {
  const firstDayOfMonth = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const mondayBasedStart = (firstDayOfMonth.getDay() + 6) % 7
  const days: Array<{ date: Date; inCurrentMonth: boolean }> = []

  for (let index = mondayBasedStart; index > 0; index -= 1) {
    days.push({
      date: new Date(year, monthIndex, 1 - index),
      inCurrentMonth: false,
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({
      date: new Date(year, monthIndex, day),
      inCurrentMonth: true,
    })
  }

  while (days.length % 7 !== 0) {
    const lastDate = days[days.length - 1]?.date ?? new Date(year, monthIndex, daysInMonth)
    days.push({
      date: new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1),
      inCurrentMonth: false,
    })
  }

  return days
}

export function BookingDatePicker({ disabled = false, minDate, onChange, value }: BookingDatePickerProps) {
  const { t } = useTranslation()
  const weekDayLabels = useMemo(
    () => [
      t('slotPicker.weekDayMon'),
      t('slotPicker.weekDayTue'),
      t('slotPicker.weekDayWed'),
      t('slotPicker.weekDayThu'),
      t('slotPicker.weekDayFri'),
      t('slotPicker.weekDaySat'),
      t('slotPicker.weekDaySun'),
    ],
    [t],
  )
  const minDateValue = minDate || formatDateValue(new Date())
  const initialReferenceDate = value || minDateValue
  const initialParts = parseDateParts(initialReferenceDate)
  const [visibleMonth, setVisibleMonth] = useState({
    year: initialParts.year,
    monthIndex: initialParts.month - 1,
  })

  const minParts = parseDateParts(minDateValue)
  const selectedValue = value || ''
  const monthLabel = useMemo(() => buildMonthLabel(visibleMonth.year, visibleMonth.monthIndex), [visibleMonth.monthIndex, visibleMonth.year])
  const days = useMemo(() => buildCalendarDays(visibleMonth.year, visibleMonth.monthIndex), [visibleMonth.monthIndex, visibleMonth.year])

  function showPreviousMonth() {
    setVisibleMonth((current) => {
      if (current.monthIndex === 0) {
        return { year: current.year - 1, monthIndex: 11 }
      }

      return { year: current.year, monthIndex: current.monthIndex - 1 }
    })
  }

  function showNextMonth() {
    setVisibleMonth((current) => {
      if (current.monthIndex === 11) {
        return { year: current.year + 1, monthIndex: 0 }
      }

      return { year: current.year, monthIndex: current.monthIndex + 1 }
    })
  }

  const canGoToPreviousMonth =
    visibleMonth.year > minParts.year ||
    (visibleMonth.year === minParts.year && visibleMonth.monthIndex > minParts.month - 1)

  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={showPreviousMonth}
          disabled={disabled || !canGoToPreviousMonth}
          aria-label={t('slotPicker.previousMonth')}
        >
          <ChevronLeft className="size-4" />
        </Button>

        <p className="text-sm font-medium text-foreground">{monthLabel}</p>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={showNextMonth}
          disabled={disabled}
          aria-label={t('slotPicker.nextMonth')}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {weekDayLabels.map((label) => (
          <div key={label} className="py-2">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(({ date, inCurrentMonth }) => {
          const dateValue = formatDateValue(date)
          const isSelected = dateValue === selectedValue
          const isPast = dateValue < minDateValue

          return (
            <button
              key={dateValue}
              type="button"
              onClick={() => onChange(dateValue)}
              disabled={disabled || isPast}
              aria-pressed={isSelected}
              className={cn(
                'flex h-10 items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isSelected ? 'bg-foreground text-background' : 'hover:bg-muted/60',
                !inCurrentMonth && !isSelected ? 'text-muted-foreground/50' : '',
                isPast ? 'cursor-not-allowed opacity-40 hover:bg-transparent' : '',
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
