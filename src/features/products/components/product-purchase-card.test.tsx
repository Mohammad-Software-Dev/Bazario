import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ProductPurchaseCard } from '@/features/products/components/product-purchase-card'
import { renderWithProviders } from '@/test/render-with-providers'

const addProductItemMock = vi.fn()
const mockUseAuth = vi.fn()

vi.mock('@/features/cart/hooks/use-cart', () => ({
  useCartActions: () => ({
    addProductItem: addProductItemMock,
  }),
}))

vi.mock('@/lib/auth/use-auth', () => ({
  useAuth: () => mockUseAuth(),
}))

const product = {
  id: 3,
  name: { en: 'Desk Lamp', ar: 'مصباح' },
  description: { en: 'Description', ar: 'وصف' },
  price: 25,
  category_id: 1,
  seller_id: 4,
  created_at: '2026-08-10T10:00:00Z',
  images: [],
  category: {
    id: 1,
    name: { en: 'Home', ar: 'المنزل' },
  },
  seller: {
    id: 4,
    user_id: 10,
    store_name: 'Store One',
    store_owner_name: 'Owner',
    logo: null,
    address: 'Berlin',
    description: null,
  },
} as never

describe('ProductPurchaseCard', () => {
  beforeEach(() => {
    addProductItemMock.mockReset()
    mockUseAuth.mockReset()
    mockUseAuth.mockReturnValue({
      session: {
        user: { id: 25 },
      },
    })
  })

  it('adds a product to the cart for a non-owner', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProductPurchaseCard product={product} />)

    await user.click(screen.getByRole('button', { name: 'Add to cart' }))

    expect(addProductItemMock).toHaveBeenCalledWith(
      expect.objectContaining({
        product_id: 3,
        name: 'Desk Lamp',
      }),
    )
  })

  it('blocks adding the owner product to the cart', () => {
    mockUseAuth.mockReturnValue({
      session: {
        user: { id: 10 },
      },
    })

    renderWithProviders(<ProductPurchaseCard product={product} />)

    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeDisabled()
    expect(
      screen.getByText('You cannot add your own product to the cart.'),
    ).toBeInTheDocument()
    expect(addProductItemMock).not.toHaveBeenCalled()
  })
})
