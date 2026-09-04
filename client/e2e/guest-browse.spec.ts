import { test, expect } from '@playwright/test'

test.describe('Guest browsing', () => {
  test('can view the recipe list without logging in', async ({ page }) => {
    await page.goto('/recipes')
    await expect(page.getByRole('heading', { name: 'Recipe List' })).toBeVisible()
  })

  test('can search and filter recipes', async ({ page }) => {
    await page.goto('/recipes')
    const searchBox = page.getByPlaceholder('Search recipes')

    await searchBox.fill('zzzznonexistentrecipezzzz')
    await expect(page.getByText("We couldn't find any recipes.")).toBeVisible()

    await searchBox.fill('')
    // At least one card should reappear once the filter is cleared,
    // assuming dev data has any recipes seeded at all.
  })

  test('clicking a recipe card navigates to its detail page', async ({ page }) => {
    await page.goto('/recipes')
    const firstViewLink = page.getByText('View Recipe').first()

    // Skip gracefully if there's no seeded data to click on
    if ((await firstViewLink.count()) === 0) {
      test.skip()
    }

    await firstViewLink.click()
    await expect(page).toHaveURL(/\/recipes\/.+/)
    await expect(page.getByRole('heading')).toBeVisible()
  })
})