const { test, expect } = require('@playwright/test');

test.describe('Event Logistics Propagation Smoke Test', () => {
  let createdEventId = null;
  let createdKp1Number = null;
  let createdKp2Number = null;

  test('should propagate logistics to multiple KPs but preserve commercial data', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.getByTestId('login-email').fill('admin@example.com');
    await page.getByTestId('login-password').fill('123456');
    await page.getByTestId('login-submit-button').click();
    await page.waitForURL('/');

    // 2. Create Event
    await page.getByText('События').first().click();
    await page.waitForURL(/\/events/);
    await page.getByRole('button', { name: 'Создать событие' }).click();
    await page.getByTestId('event-title').fill('[SMOKE] Propagation Event');
    await page.getByTestId('event-date').fill('2025-01-01');
    await page.getByTestId('event-location').fill('Initial Place');
    await page.getByTestId('event-save-button').click();
    
    await page.waitForURL(/\/events\/\d+/);
    const eventUrl = page.url();
    createdEventId = eventUrl.split('/').pop();

    // 3. Create KP 1 linked to Event
    await page.getByText('Новое КП').first().click();
    await page.waitForURL(/\/new|\/create/);
    await page.getByTestId('kp-contract-number').fill('PROP-01');
    await page.getByTestId('kp-event-select').selectOption({ label: `[SMOKE] Propagation Event (2025-01-01)` });
    await page.getByTestId('kp-count-of-person').fill('10');
    await page.getByTestId('kp-logistics').fill('0');
    // Commercial data
    await page.getByTestId('kp-add-row-button').click();
    await page.getByTestId('product-name').fill('Prop Item 1');
    await page.getByTestId('product-quantity').fill('5');
    await page.getByTestId('product-price').fill('100');
    await page.getByTestId('product-save-button').click();
    await expect(page.locator('.popup')).toBeHidden();
    await page.getByTestId('kp-save-list-button').click();
    
    await page.getByTestId('kp-save-button').click();
    await page.waitForURL(/\/kp\/\d+/);
    const kp1Url = page.url();
    createdKp1Number = kp1Url.split('/').pop();

    // 4. Create KP 2 linked to Event
    await page.getByText('Новое КП').first().click();
    await page.waitForURL(/\/new|\/create/);
    await page.getByTestId('kp-contract-number').fill('PROP-02');
    await page.getByTestId('kp-event-select').selectOption({ label: `[SMOKE] Propagation Event (2025-01-01)` });
    await page.getByTestId('kp-count-of-person').fill('20');
    await page.getByTestId('kp-logistics').fill('0');
    // Commercial data
    await page.getByTestId('kp-add-row-button').click();
    await page.getByTestId('product-name').fill('Prop Item 2');
    await page.getByTestId('product-quantity').fill('10');
    await page.getByTestId('product-price').fill('200');
    await page.getByTestId('product-save-button').click();
    await expect(page.locator('.popup')).toBeHidden();
    await page.getByTestId('kp-save-list-button').click();
    
    await page.getByTestId('kp-save-button').click();
    await page.waitForURL(/\/kp\/\d+/);
    const kp2Url = page.url();
    createdKp2Number = kp2Url.split('/').pop();

    // 5. Edit Event - DECLINE propagation
    await page.goto(`/events/${createdEventId}/edit`);
    await page.getByTestId('event-date').fill('2025-02-02');
    
    // Set up dialog handler for DECLINE
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('Обновить дату/тайминг/адрес');
      await dialog.dismiss();
    });
    
    await page.getByTestId('event-save-button').click();
    await page.waitForURL(/\/events\/\d+/);

    // Verify KP 1 is NOT updated
    await page.goto(`/kp/${createdKp1Number}`);
    await expect(page.locator('text=02.02').first()).not.toBeVisible();
    await expect(page.locator('text=01.01').first()).toBeVisible();

    // 6. Edit Event - ACCEPT propagation
    await page.goto(`/events/${createdEventId}/edit`);
    await page.getByTestId('event-location').fill('Updated Place');
    
    // Set up dialog handler for ACCEPT
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('Обновить дату/тайминг/адрес');
      await dialog.accept();
    });
    
    await page.getByTestId('event-save-button').click();
    await page.waitForURL(/\/events\/\d+/);

    // 7. Verify KP 1 IS updated and commercial data preserved
    await page.goto(`/kp/${createdKp1Number}`);
    // KP header logistics
    await expect(page.locator('text=02.02').first()).toBeVisible();
    await expect(page.locator('text=Updated Place').first()).toBeVisible();
    // Legacy List logistics (assuming they are visible in preview)
    // Commercial data preserved
    await expect(page.locator('text=Prop Item 1').first()).toBeVisible();

    // 8. Verify KP 2 IS updated and commercial data preserved
    await page.goto(`/kp/${createdKp2Number}`);
    await expect(page.locator('text=02.02').first()).toBeVisible();
    await expect(page.locator('text=Updated Place').first()).toBeVisible();
    await expect(page.locator('text=Prop Item 2').first()).toBeVisible();
  });
});
