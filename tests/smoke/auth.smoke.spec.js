const { test, expect } = require('@playwright/test');

test.describe('Authentication Smoke Test', () => {
  test('should login and load protected layout', async ({ page }) => {
    // 1. open login page
    await page.goto('/login');

    // 2. login (using explicit selectors)
    await page.getByTestId('login-email').fill('admin@example.com');
    await page.getByTestId('login-password').fill('123456');
    await page.getByTestId('login-submit-button').click();

    // 3. verify sidebar and header are visible
    // Wait for network/navigation
    await page.waitForURL('/');

    // Verify header exists
    await expect(page.locator('header')).toBeVisible({ timeout: 10000 });
    
    // Verify sidebar exists
    await expect(page.locator('aside, .sidebar')).toBeVisible();
    
    // Verify protected layout is loaded (e.g. log out button or user profile exists)
    await expect(page.getByRole('button', { name: /Выйти/i })).toBeVisible();
  });
});
