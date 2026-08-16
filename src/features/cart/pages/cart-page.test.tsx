import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CartPage } from '@/features/cart/pages/cart-page'
import { renderWithProviders } from '@/test/render-with-providers'

const mutateMock = vi.fn()
const openLoginDialogMock = vi.fn()

vi.mock('@/features/cart/hooks/use-cart', () => ({
  useCartItems: vi.fn(),
  useCartSummary: vi.fn(),
  useCartActions: vi.fn(),
}))

vi.mock('@/features/orders/hooks/use-checkout-mutation', () => ({
  useCheckoutMutation: vi.fn(),
}))

vi.mock('@/lib/auth/use-auth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/stores/ui-store', () => ({
  useUiStore: (selector: (state: { openLoginDialog: () => void }) => unknown) =>
    selector({ openLoginDialog: openLoginDialogMock }),
}))

const { useCartItems, useCartSummary, useCartActions } = await import('@/features/cart/hooks/use-cart')
const { useCheckoutMutation } = await import('@/features/orders/hooks/use-checkout-mutation')
const { useAuth } = await import('@/lib/auth/use-auth')

describe('CartPage', () => {
  beforeEach(() => {
    openLoginDialogMock.mockReset()
    mutateMock.mockReset()

    vi.mocked(useCartItems).mockReturnValue([])
    vi.mocked(useCartSummary).mockReturnValue({
      currency: 'EUR',
      item_count: 0,
      product_count: 0,
      service_count: 0,
      subtotal: 0,
    })
    vi.mocked(useCartActions).mockReturnValue({
      clearCart: vi.fn(),
      removeItem: vi.fn(),
      updateProductQuantity: vi.fn(),
      addProductItem: vi.fn(),
      addServiceItem: vi.fn(),
    })
    vi.mocked(useCheckoutMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
      isError: false,
      error: null,
    } as never)
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
    } as never)
  })

  it('shows the empty cart state', () => {
    renderWithProviders(<CartPage />)

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })

  it('opens the login dialog when checkout is attempted while signed out', async () => {
    const user = userEvent.setup()
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false } as never)
    vi.mocked(useCartItems).mockReturnValue([
      {
        type: 'product',
        cart_item_id: 'product-1',
        product_id: 1,
        quantity: 1,
        name: 'Desk Lamp',
        price: 15,
        seller_name: 'Seller One',
      },
    ])
    vi.mocked(useCartSummary).mockReturnValue({
      currency: 'EUR',
      item_count: 1,
      product_count: 1,
      service_count: 0,
      subtotal: 15,
    })

    renderWithProviders(<CartPage />)

    await user.click(screen.getByRole('button', { name: 'Checkout' }))

    expect(openLoginDialogMock).toHaveBeenCalledTimes(1)
    expect(mutateMock).not.toHaveBeenCalled()
  })

  it('submits current cart items to checkout when authenticated', async () => {
    const user = userEvent.setup()
    const items = [
      {
        type: 'product' as const,
        cart_item_id: 'product-1',
        product_id: 1,
        quantity: 2,
        name: 'Desk Lamp',
        price: 15,
        seller_name: 'Seller One',
      },
    ]
    vi.mocked(useCartItems).mockReturnValue(items)
    vi.mocked(useCartSummary).mockReturnValue({
      currency: 'EUR',
      item_count: 1,
      product_count: 2,
      service_count: 0,
      subtotal: 30,
    })

    renderWithProviders(<CartPage />)

    await user.click(screen.getByRole('button', { name: 'Checkout' }))

    expect(mutateMock).toHaveBeenCalledWith(items)
  })
})
