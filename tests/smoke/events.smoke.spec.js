const { test, expect } = require('@playwright/test');

test.describe('Events Smoke Test', () => {
  test('should create Event, edit title, and save', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email').fill('admin@example.com');
    await page.getByTestId('login-password').fill('123456');
    await page.getByTestId('login-submit-button').click();
    await page.waitForURL('/');

    await page.getByText('События').first().click();
    await page.waitForURL(/\/events/);
    await page.getByRole('button', { name: 'Создать событие' }).click();

    await page.getByTestId('event-title').fill('Smoke Event Initial'); // Title
    await page.getByTestId('event-date').fill('2026-12-12'); // Date
    await page.locator('input[type="time"]').nth(0).fill('10:00'); // Start Time
    await page.getByTestId('event-location').fill('Smoke Event Place'); // Location
    
    await page.getByTestId('event-save-button').click();
    await page.waitForURL(/\/events\/\d+/);

    await page.getByRole('button', { name: /Редактировать/ }).click();
    await page.waitForURL(/\/events\/\d+\/edit/);
    
    await page.getByTestId('event-title').fill('Smoke Event Updated');
    await page.getByTestId('event-save-button').click();
    await page.waitForURL(/\/events\/\d+/);

    await expect(page.locator('text=Smoke Event Updated').first()).toBeVisible();
  });
});
