import type { PropsWithChildren, ReactElement } from 'react'
import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import i18n from '@/lib/i18n'

interface RenderWithProvidersOptions {
  initialEntries?: string[]
  language?: 'en' | 'de' | 'ar'
}

export function renderWithProviders(ui: ReactElement, options: RenderWithProvidersOptions = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  void i18n.changeLanguage(options.language ?? 'en')

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={options.initialEntries}>{children}</MemoryRouter>
        </QueryClientProvider>
      </I18nextProvider>
    )
  }

  return render(ui, {
    wrapper: Wrapper,
  })
}
