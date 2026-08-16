import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CancelBookingDialog } from '@/features/orders/components/cancel-booking-dialog'
import { renderWithProviders } from '@/test/render-with-providers'

const mutateMock = vi.fn()

vi.mock('@/features/orders/hooks/use-cancel-booking-mutation', () => ({
  useCancelBookingMutation: vi.fn(),
}))

const { useCancelBookingMutation } = await import('@/features/orders/hooks/use-cancel-booking-mutation')

describe('CancelBookingDialog', () => {
  beforeEach(() => {
    mutateMock.mockReset()
    vi.mocked(useCancelBookingMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
      isError: false,
      error: null,
    } as never)
  })

  it('submits trimmed reason and closes on success', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    mutateMock.mockImplementation((_payload, options) => {
      options.onSuccess()
    })

    renderWithProviders(<CancelBookingDialog bookingId={5} open onOpenChange={onOpenChange} />)

    await user.type(screen.getByLabelText('Reason (optional)'), '  Needs to move  ')
    await user.click(screen.getByRole('button', { name: 'Confirm cancellation' }))

    expect(mutateMock).toHaveBeenCalledWith(
      { bookingId: 5, reason: 'Needs to move' },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    )
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('shows error state when cancellation fails', () => {
    vi.mocked(useCancelBookingMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
      isError: true,
      error: new Error('Cancel failed'),
    } as never)

    renderWithProviders(<CancelBookingDialog bookingId={5} open onOpenChange={vi.fn()} />)

    expect(screen.getByText('Cancel failed')).toBeInTheDocument()
  })
})
