const { test, expect } = require('@playwright/test');

test.describe('KP Lifecycle Smoke Test', () => {
  test('should create draft KP and auto-transition to sent on PDF download', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.getByTestId('login-email').fill('admin@example.com');
    await page.getByTestId('login-password').fill('123456');
    await page.getByTestId('login-submit-button').click();
    await page.waitForURL('/');

    // 2. Create KP
    await page.getByText('Новое КП').first().click();
    await page.waitForURL(/\/new|\/create/);

    await expect(page.locator('label', { hasText: 'Номер' })).toBeVisible({ timeout: 10000 });
    
    // Fill minimal details
    await page.getByTestId('kp-contract-number').fill('LIFECYCLE-KP');
    await page.getByTestId('kp-event-place').fill('[SMOKE] Lifecycle Place');
    await page.getByTestId('kp-count-of-person').fill('10');
    await page.getByTestId('kp-logistics').fill('0');
    await page.getByTestId('kp-event-title').fill('[SMOKE] Lifecycle KP');

    await page.getByTestId('kp-add-row-button').click();
    await page.getByTestId('product-name').fill('Smoke Item');
    await page.getByTestId('product-quantity').fill('10');
    await page.getByTestId('product-price').fill('500');
    await page.getByTestId('product-save-button').click();
    
    await page.getByTestId('kp-save-list-button').click();
    
    await page.getByTestId('kp-save-button').click();
    await page.waitForURL(/\/preview/);

    // 3. Verify it starts as draft in Preview metadata block
    // Assuming the Select element shows 'Черновик'
    await expect(page.getByTestId('preview-status-select')).toHaveText(/Черновик/);

    // 4. Trigger PDF Download
    // Note: Playwright intercepts downloads
    const downloadPromise = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
    await page.getByRole('button', { name: 'Скачать PDF' }).click();
    await downloadPromise; // wait for download to start (or timeout)

    // Give it a moment to update state via API
    await page.waitForTimeout(1000);

    // 5. Verify status transitioned to sent
    await expect(page.getByTestId('preview-status-select')).toHaveText(/Отправлено/);

    // 6. Change status manually
    await page.getByTestId('preview-status-select').click();
    await page.getByText('Согласовано').click();
    
    await page.waitForTimeout(500);
    await expect(page.getByTestId('preview-status-select')).toHaveText(/Согласовано/);

    // 7. Download PDF again and verify it DOES NOT transition back to sent or anything else
    const downloadPromise2 = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
    await page.getByRole('button', { name: 'Скачать PDF' }).click();
    await downloadPromise2;
    
    await page.waitForTimeout(500);
    await expect(page.getByTestId('preview-status-select')).toHaveText(/Согласовано/);
  });
});
