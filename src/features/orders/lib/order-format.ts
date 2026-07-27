import { getLocalizedValue } from '@/lib/localized-value'

import type {
  BookingServiceSummary,
  CustomerBookingRecord,
  OrderItemRecord,
  OrderRecord,
  StripeRefundRecord,
} from '@/features/orders/types/order.types'

export function formatOrderMoney(amount: number, currencyIso = 'EUR') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyIso,
  }).format(amount / 100)
}

export function formatOrderDate(value?: string | null) {
  if (!value) {
    return 'N/A'
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function formatBookingWindow(startsAt: string, endsAt: string, timezone?: string | null) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone || 'UTC',
  })

  return `${formatter.format(new Date(startsAt))} - ${formatter.format(new Date(endsAt))}`
}

export function formatBookingCutoff(value?: string | null, timezone?: string | null) {
  if (!value) {
    return null
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone || 'UTC',
  }).format(new Date(value))
}

export function getOrderItemDisplayTitle(item: OrderItemRecord) {
  return item.title_snapshot || 'Order item'
}

export function getBookingServiceTitle(service: BookingServiceSummary) {
  return typeof service.title === 'string' ? service.title : getLocalizedValue(service.title) || 'Service'
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
  return booking.provider_user?.name || 'Service provider'
}

export function getBookingLocalDateValue(booking: Pick<CustomerBookingRecord, 'starts_at' | 'timezone'>) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
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
