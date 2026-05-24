const { test, expect } = require('@playwright/test');

test.describe('Contractor ↔ KP Visibility Smoke Test', () => {
  test('should link a KP to Contractor and verify visibility with status', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.getByTestId('login-email').fill('admin@example.com');
    await page.getByTestId('login-password').fill('123456');
    await page.getByTestId('login-submit-button').click();
    await page.waitForURL('/');

    // 2. Create Contractor
    await page.getByText('Контрагенты').first().click();
    await page.waitForURL(/\/contractors/);
    await page.getByRole('button', { name: 'Добавить контрагента' }).click();
    
    await page.getByPlaceholder('ООО КатерингСервис').fill('[SMOKE] Visible Contractor');
    await page.getByRole('button', { name: 'Сохранить' }).click();
    await page.waitForURL(/\/contractors/);

    // 3. Create KP
    await page.getByText('Новое КП').first().click();
    await page.waitForURL(/\/new|\/create/);

    await expect(page.locator('label', { hasText: 'Номер' })).toBeVisible({ timeout: 10000 });
    
    await page.getByTestId('kp-contract-number').fill('LINK-KP');
    await page.getByTestId('kp-event-place').fill('[SMOKE] Place');
    await page.getByTestId('kp-count-of-person').fill('10');
    await page.getByTestId('kp-logistics').fill('0');
    await page.getByTestId('kp-event-title').fill('[SMOKE] KP for Contractor Link');

    // Link Contractor
    await page.getByTestId('kp-contractor-select').click();
    await page.getByText('[SMOKE] Visible Contractor', { exact: true }).first().click();

    // Select Status "Отправлено"
    await page.getByTestId('kp-status-select').click();
    await page.getByText('Отправлено', { exact: true }).first().click();

    await page.getByTestId('kp-add-row-button').click();
    await page.getByTestId('product-name').fill('Smoke Item');
    await page.getByTestId('product-quantity').fill('10');
    await page.getByTestId('product-price').fill('500');
    await page.getByTestId('product-save-button').click();
    
    await page.getByTestId('kp-save-list-button').click();
    
    await page.getByTestId('kp-save-button').click();
    await page.waitForURL(/\/preview/);

    // 4. Verify in Contractor Details
    await page.getByText('Контрагенты').first().click();
    await page.waitForURL(/\/contractors/);
    
    // Click on the contractor name in the list to open details
    await page.getByText('[SMOKE] Visible Contractor').first().click();
    await page.waitForURL(/\/contractors\/\d+/);

    // Verify KP is in the table
    await expect(page.getByText('[SMOKE] Place').first()).toBeVisible();
    await expect(page.getByText('Отправлено').first()).toBeVisible();
  });
});
