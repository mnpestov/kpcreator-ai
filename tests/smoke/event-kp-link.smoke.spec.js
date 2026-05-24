const { test, expect } = require('@playwright/test');

test.describe('Event ↔ KP Link Smoke Test', () => {
  test('should link an event during KP creation safely', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email').fill('admin@example.com');
    await page.getByTestId('login-password').fill('123456');
    await page.getByTestId('login-submit-button').click();
    await page.waitForURL('/');

    await page.getByText('События').first().click();
    await page.waitForURL(/\/events/);
    await page.getByRole('button', { name: 'Создать событие' }).click();

    await page.getByTestId('event-title').fill('Linkable Smoke Event'); // Title
    await page.getByTestId('event-date').fill('2026-10-10'); // Date
    
    await page.getByTestId('event-save-button').click();
    await page.waitForURL(/\/events\/\d+/);

    await page.getByText('Новое КП').first().click();
    await page.waitForURL(/\/new|\/create/);

    await expect(page.locator('label', { hasText: 'Номер' })).toBeVisible({ timeout: 10000 });
    
    await page.getByTestId('kp-contract-number').fill('LINK-DOC');
    await page.getByTestId('kp-event-place').fill('Link Place');
    await page.getByTestId('kp-count-of-person').fill('10');
    await page.getByTestId('kp-logistics').fill('0');
    await page.getByTestId('kp-event-title').fill('KP for Link');


    await page.getByTestId('kp-add-row-button').click();
    await page.getByTestId('product-name').fill('Smoke Item');
    await page.getByTestId('product-quantity').fill('10');
    await page.getByTestId('product-price').fill('500');
    await page.getByTestId('product-save-button').click();
    
    await page.getByTestId('kp-save-list-button').click();

    // Link event (using select dropdown)
    await page.getByTestId('kp-event-select').selectOption({ label: 'Linkable Smoke Event (2026-10-10)' });
    
    await page.getByTestId('kp-save-button').click();
    await page.waitForURL(/\/preview/);

    await expect(page.locator('text=Linkable Smoke Event').first()).toBeVisible();
  });
});
