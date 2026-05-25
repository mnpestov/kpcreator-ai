const { test, expect } = require('@playwright/test');

test.describe('Event Schedule Domain Correction Smoke Test', () => {
  let eventId = null;
  let kpNumber = null;

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email').fill('admin@example.com');
    await page.getByTestId('login-password').fill('123456');
    await page.getByTestId('login-submit-button').click();
    await page.waitForURL('/');
  });

  test('should create multi-day event, edit it, select in KP, and propagate successfully', async ({ page }) => {
    // 1. Create multi-day event
    await page.getByText('События').first().click();
    await page.waitForURL(/\/events/);
    await page.getByRole('button', { name: 'Создать событие' }).click();
    await page.getByTestId('event-title').fill('[SMOKE] Multi-day Event');
    
    // Fill first day
    await page.getByTestId('event-date').fill('2025-05-01'); // maps to startEvent
    
    await page.getByTestId('event-start-time-start').fill('10:00');
    await page.getByTestId('event-end-time-start').fill('20:00');

    // Fill last day
    await page.getByTestId('event-end-date').fill('2025-05-03');
    await page.getByTestId('event-start-time-end').fill('09:00');
    await page.getByTestId('event-end-time-end').fill('18:00');
    
    await page.getByTestId('event-save-button').click();
    await page.waitForURL(/\/events\/\d+/);
    
    const eventUrl = page.url();
    eventId = eventUrl.split('/').pop();

    // 2. Select Event into KP and check mapping
    await page.getByText('Новое КП').first().click();
    await page.waitForURL(/\/new|\/create/);
    await page.getByTestId('kp-contract-number').fill('MULTI-01');
    
    // Select the event
    await page.getByTestId('kp-event-select').selectOption({ label: `[SMOKE] Multi-day Event (2025-05-01)` });

    // Assert the KP form is populated correctly!
    await expect(page.getByTestId('kp-start-event-date').locator('input[type="text"]')).toHaveValue('01.05.2025');
    // For end date we didn't add test id, let's use label
    await expect(page.locator('div.form__field', { has: page.locator('label:has-text("Дата окончания")') }).locator('input[type="text"]')).toHaveValue('03.05.2025');
    
    await expect(page.getByLabel('Время начала').first()).toHaveValue('10:00');
    // Note: The UI for time inputs varies, but we assume it maps correctly.

    // Fill minimum KP data to save
    await page.getByTestId('kp-count-of-person').fill('100');
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
    
    kpNumber = page.url().split('/').pop();

    // 3. Edit Event schedule and Propagate
    await page.goto(`/events/${eventId}/edit`);
    
    // Edit last day end time
    await page.getByTestId('event-end-time-end').fill('15:00');
    
    // Accept propagation
    page.once('dialog', async dialog => {
      await dialog.accept();
    });
    
    await page.getByTestId('event-save-button').click();
    await page.waitForURL(/\/events\/\d+/);

    // Verify propagation
    await page.goto(`/kp/${kpNumber}/edit`);
    
    // Wait for form to load
    await expect(page.locator('div.form__field', { has: page.locator('label:has-text("Дата окончания")') }).locator('input[type="text"]')).toHaveValue('03.05.2025');
  });
});
