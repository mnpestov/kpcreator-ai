const { test, expect } = require('@playwright/test');

test.describe('KP Smoke Test', () => {
  test('should create new KP, fill fields and save', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email').fill('admin@example.com');
    await page.getByTestId('login-password').fill('123456');
    await page.getByTestId('login-submit-button').click();
    await page.waitForURL('/');

    await page.getByText('Новое КП').first().click();
    await page.waitForURL(/\/new|\/create/);

    await expect(page.locator('label', { hasText: 'Номер' })).toBeVisible({ timeout: 10000 });
    
    // Fill required text fields by selecting input right after label
    await page.getByTestId('kp-contract-number').fill('SMOKE-DOC');
    await page.getByTestId('kp-event-place').fill('Smoke Place');
    await page.getByTestId('kp-count-of-person').fill('50');
    await page.getByTestId('kp-logistics').fill('1000');
    await page.getByTestId('kp-event-title').fill('Smoke Event Title');
    
    await page.getByTestId('kp-add-row-button').click();
    await page.getByTestId('product-name').fill('Smoke Item');
    await page.getByTestId('product-quantity').fill('10');
    await page.getByTestId('product-price').fill('500');
    await page.getByTestId('product-save-button').click();
    
    await page.getByTestId('kp-save-list-button').click();
    
    await page.getByTestId('kp-save-button').click();
    await page.waitForURL(/\/preview/);
    
    await expect(page.locator('text=Smoke Event Title').first()).toBeVisible();
  });
});
