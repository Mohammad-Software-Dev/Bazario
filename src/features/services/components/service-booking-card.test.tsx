import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ServiceBookingCard } from '@/features/services/components/service-booking-card'
import { renderWithProviders } from '@/test/render-with-providers'

const addServiceItemMock = vi.fn()
const mockUseCartItems = vi.fn()
const mockUseServiceAvailabilityQuery = vi.fn()

vi.mock('@/features/cart/hooks/use-cart', () => ({
  useCartActions: () => ({
    addServiceItem: addServiceItemMock,
  }),
  useCartItems: () => mockUseCartItems(),
}))

vi.mock('@/features/services/hooks/use-service-availability-query', () => ({
  useServiceAvailabilityQuery: () => mockUseServiceAvailabilityQuery(),
}))

vi.mock('@/features/services/components/service-slot-picker', () => ({
  ServiceSlotPicker: ({
    slots,
    selectedSlot,
    onSlotSelect,
  }: {
    slots: Array<{ starts_at: string; ends_at: string }>
    selectedSlot: { starts_at: string } | null
    onSlotSelect: (slot: { starts_at: string; ends_at: string }) => void
  }) => (
    <div>
      <p>Slot count {slots.length}</p>
      <p>Selected slot {selectedSlot?.starts_at ?? 'none'}</p>
      {slots[0] ? (
        <button type="button" onClick={() => onSlotSelect(slots[0])}>
          Choose first slot
        </button>
      ) : null}
    </div>
  ),
}))

const service = {
  id: 4,
  title: { en: 'Consultation', ar: 'استشارة' },
  description: { en: 'Description', ar: 'وصف' },
  price: 50,
  category_id: 2,
  provider_id: 8,
  created_at: '2026-08-10T10:00:00Z',
  is_active: true,
  location_type: 'remote',
  images: [],
  category: {
    id: 2,
    name: { en: 'Business', ar: 'أعمال' },
  },
  service_provider: {
    id: 8,
    user_id: 10,
    name: 'Provider One',
    logo: null,
    address: 'Berlin',
    description: null,
  },
} as never

describe('ServiceBookingCard', () => {
  beforeEach(() => {
    addServiceItemMock.mockReset()
    mockUseCartItems.mockReset()
    mockUseServiceAvailabilityQuery.mockReset()
    mockUseCartItems.mockReturnValue([])
    mockUseServiceAvailabilityQuery.mockReturnValue({
      data: {
        slots: [
          {
            starts_at: '2026-08-20T10:00:00Z',
            ends_at: '2026-08-20T11:00:00Z',
            remaining_capacity: 1,
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
    })
  })

  it('disables add to cart until a slot is selected', () => {
    renderWithProviders(<ServiceBookingCard service={service} />)

    expect(screen.getByRole('button', { name: 'Add booking to cart' })).toBeDisabled()
  })

  it('adds the selected slot to cart', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ServiceBookingCard service={service} />)

    await user.click(screen.getByRole('button', { name: 'Choose first slot' }))
    await user.click(screen.getByRole('button', { name: 'Add booking to cart' }))

    expect(addServiceItemMock).toHaveBeenCalledWith(
      expect.objectContaining({
        service_id: 4,
        title: 'Consultation',
        provider_name: 'Provider One',
        starts_at: '2026-08-20T10:00:00Z',
        ends_at: '2026-08-20T11:00:00Z',
      }),
    )
  })
})
