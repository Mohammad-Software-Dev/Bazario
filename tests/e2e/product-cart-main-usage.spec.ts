import { expect, test } from '@playwright/test'

import { seededProductFixture } from './helpers/catalog-fixtures'
import { clearAppStorage, forceEnglishLanguage } from './helpers/storage'

test.describe('Main marketplace usage', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppStorage(page)
    await forceEnglishLanguage(page)
  })

  test('lets a customer open a product, add it to cart, and review it in the cart summary', async ({
    page,
  }) => {
    await page.goto(`/products/${seededProductFixture.id}`)

    await expect(page).toHaveURL(new RegExp(`/products/${seededProductFixture.id}$`))
    await expect(page.getByText(seededProductFixture.name)).toBeVisible()
    await expect(page.getByText(seededProductFixture.sellerName)).toBeVisible()

    const quantityInput = page.locator('#product-quantity')
    await quantityInput.fill(String(seededProductFixture.quantity))
    await page.getByRole('button', { name: 'Add to cart' }).click()

    await expect(page.getByText('Added to cart.')).toBeVisible()

    await page.goto('/cart')

    await expect(page).toHaveURL(/\/cart$/)
    await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible()
    await expect(page.getByRole('heading', { name: seededProductFixture.name })).toBeVisible()
    await expect(page.getByText(seededProductFixture.sellerName)).toBeVisible()
    await expect(page.getByText(`Unit price: ${seededProductFixture.unitPrice}`)).toBeVisible()
    await expect(page.getByText(`Line total: ${seededProductFixture.lineTotal}`)).toBeVisible()

    const cartQuantityInput = page.getByRole('spinbutton')
    await expect(cartQuantityInput).toHaveValue(String(seededProductFixture.quantity))

    const summaryArea = page.locator('aside')
    await expect(summaryArea).toContainText('Summary')
    await expect(summaryArea).toContainText('Items')
    await expect(summaryArea).toContainText('1')
    await expect(summaryArea).toContainText('Products')
    await expect(summaryArea).toContainText('2')
    await expect(summaryArea).toContainText('Services')
    await expect(summaryArea).toContainText('0')
    await expect(summaryArea).toContainText('€799.98')
    await expect(page.getByRole('button', { name: 'Checkout' })).toBeEnabled()
  })
})
