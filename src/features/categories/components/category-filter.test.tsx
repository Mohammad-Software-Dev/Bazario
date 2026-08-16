import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CategoryFilter } from '@/features/categories/components/category-filter'
import { renderWithProviders } from '@/test/render-with-providers'

describe('CategoryFilter', () => {
  it('renders categories and calls onCategoryChange', async () => {
    const user = userEvent.setup()
    const onCategoryChange = vi.fn()

    renderWithProviders(
      <CategoryFilter
        categories={[
          { id: 1, name: { en: 'Home', ar: 'المنزل' } },
          { id: 2, name: { en: 'Business', ar: 'أعمال' } },
        ] as never}
        selectedCategoryId={2}
        onCategoryChange={onCategoryChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'All' }))
    await user.click(screen.getByRole('button', { name: 'Home' }))

    expect(onCategoryChange).toHaveBeenNthCalledWith(1, undefined)
    expect(onCategoryChange).toHaveBeenNthCalledWith(2, 1)
  })
})
