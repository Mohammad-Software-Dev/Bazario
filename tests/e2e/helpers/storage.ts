import type { Page } from '@playwright/test'

export async function forceEnglishLanguage(page: Page) {
  await page.goto('/')
  await page.evaluate(() => {
    window.localStorage.setItem('bazario-language', 'en')
  })
  await page.reload()
}

export async function clearAppStorage(page: Page) {
  await page.goto('/')
  await page.evaluate(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.localStorage.setItem('bazario-language', 'en')
  })
  await page.reload()
}
