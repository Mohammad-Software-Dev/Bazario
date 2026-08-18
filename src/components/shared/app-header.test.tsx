import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AppHeader } from '@/components/shared/app-header'
import { renderWithProviders } from '@/test/render-with-providers'

const navigateMock = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('@/features/auth/hooks/use-logout-mutation', () => ({
  useLogoutMutation: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}))

vi.mock('@/features/cart/hooks/use-cart', () => ({
  useCartCount: () => 0,
}))

vi.mock('@/features/chat/hooks/use-chat-unread-count-query', () => ({
  useChatUnreadCountQuery: () => ({
    data: { result: { total: 0 } },
  }),
}))

vi.mock('@/features/chat/hooks/use-chat-unread-subscription', () => ({
  useChatUnreadSubscription: () => undefined,
}))

vi.mock('@/lib/auth/use-auth', () => ({
  useAuth: () => ({
    session: null,
    isAuthenticated: false,
  }),
}))

vi.mock('@/stores/ui-store', () => ({
  useUiStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      openLoginDialog: vi.fn(),
      isMobileNavOpen: false,
      setMobileNavOpen: vi.fn(),
    }),
}))

describe('AppHeader language switcher', () => {
  beforeEach(() => {
    navigateMock.mockReset()
  })

  it('shows AR and switches the document to rtl when selected', async () => {
    const user = userEvent.setup()

    renderWithProviders(<AppHeader />)

    expect(screen.getByRole('button', { name: 'Arabic' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Arabic' }))

    await waitFor(() => {
      expect(document.documentElement.lang).toBe('ar')
      expect(document.documentElement.dir).toBe('rtl')
    })
  })
})
