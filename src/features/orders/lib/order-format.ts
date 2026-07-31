import i18n from '@/lib/i18n'
import { formatDateTime, formatMinorMoney, getAppLanguage } from '@/lib/i18n/format'
import { getLocalizedValue } from '@/lib/localized-value'

import type {
  BookingServiceSummary,
  CustomerBookingRecord,
  OrderItemRecord,
  OrderRecord,
  StripeRefundRecord,
} from '@/features/orders/types/order.types'

export function formatOrderMoney(amount: number, currencyIso = 'EUR') {
  return formatMinorMoney(amount, currencyIso)
}

export function formatOrderDate(value?: string | null) {
  if (!value) {
    return 'N/A'
  }

  return formatDateTime(value, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function formatBookingWindow(startsAt: string, endsAt: string, timezone?: string | null) {
  return `${formatDateTime(startsAt, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone || 'UTC',
  })} - ${formatDateTime(endsAt, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone || 'UTC',
  })}`
}

export function formatBookingCutoff(value?: string | null, timezone?: string | null) {
  if (!value) {
    return null
  }

  return formatDateTime(value, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone || 'UTC',
  })
}

export function getOrderItemDisplayTitle(item: OrderItemRecord) {
  return item.title_snapshot || i18n.t('orders.noItemsAdded')
}

export function getBookingServiceTitle(service: BookingServiceSummary) {
  return typeof service.title === 'string'
    ? service.title
    : getLocalizedValue(service.title, getAppLanguage()) || i18n.t('providerBookings.service')
}

export function getLatestRefund(item: { stripe_refunds?: StripeRefundRecord[] } | undefined | null) {
  const refunds = item?.stripe_refunds ?? []

  return [...refunds].sort((left, right) => {
    return new Date(right.created_at ?? 0).getTime() - new Date(left.created_at ?? 0).getTime()
  })[0] ?? null
}

export function getOrderPrimaryDate(order: OrderRecord) {
  return order.paid_at || order.placed_at || order.created_at || null
}

export function getBookingPrimaryProviderName(booking: CustomerBookingRecord) {
  return booking.provider_user?.name || i18n.t('catalog.independentProvider')
}

export function getBookingLocalDateValue(booking: Pick<CustomerBookingRecord, 'starts_at' | 'timezone'>) {
  const locale = getAppLanguage() === 'de' ? 'de-DE' : 'en-CA'
  const formatter = new Intl.DateTimeFormat(locale, {
    timeZone: booking.timezone || 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return formatter.format(new Date(booking.starts_at))
}

export function isSameBookingWindow(booking: Pick<CustomerBookingRecord, 'starts_at' | 'ends_at'>, startsAt: string, endsAt: string) {
  return booking.starts_at === startsAt && booking.ends_at === endsAt
}
