import { expect, test } from '@nuxt/test-utils/playwright'

test('home page loads', async ({ page, goto }) => {
  const res = await goto('/', { waitUntil: 'hydration' })

  expect(res?.ok()).toBe(true)
  expect(await page.title()).toBe('Local Timeline | Elk')
  expect(page.getByRole('heading')).toHaveText('Elk')
})
