const { test, expect } = require('@playwright/test');

test.describe('Menu Directory CRUD and KP Integration', () => {
  // Use a unique suffix to avoid collisions in parallel runs or DB state
  const uniqueSuffix = Date.now();
  const testMenuTitle = `Smoke Burger ${uniqueSuffix}`;
  const testMenuTitleUpdated = `${testMenuTitle} Updated`;

  test.beforeEach(async ({ page }) => {
    // 1. Go to login page
    await page.goto('/login');
    // 2. Fill credentials
    await page.getByTestId('login-email').fill('admin@example.com');
    await page.getByTestId('login-password').fill('123456');
    // 3. Submit
    await page.getByTestId('login-submit-button').click();
    // 4. Wait for dashboard (assuming / or something like "Список КП")
    await expect(page.getByText('Последние коммерческие предложения')).toBeVisible();
  });

  test('Create and Edit Menu Item', async ({ page }) => {
    // Navigate to Menu Directory
    await page.getByRole('button', { name: 'Меню', exact: true }).click();
    await expect(page.getByText('Меню / Блюда')).toBeVisible();

    // Create new menu item
    await page.getByRole('button', { name: 'Добавить позицию' }).click();
    await expect(page.getByText('Новая позиция меню')).toBeVisible();

    await page.getByPlaceholder('Например: Сет бургеров').fill(testMenuTitle);
    await page.getByPlaceholder('Описание блюда или состав...').fill('Булка, котлета, сыр');
    
    // Fill price and weight
    await page.locator('input[type="number"]').first().fill('500'); // Price
    await page.locator('input[type="number"]').nth(1).fill('250'); // Weight
    
    await page.getByRole('button', { name: 'Создать позицию' }).click();

    // Verify it appeared in the list
    await expect(page.getByText(testMenuTitle)).toBeVisible();

    // Edit the menu item
    await page.getByText(testMenuTitle).click(); // Go to details
    await expect(page.getByText('Детальная информация о позиции меню')).toBeVisible();
    await page.getByRole('button', { name: 'Редактировать' }).click();
    
    await page.getByPlaceholder('Например: Сет бургеров').fill(testMenuTitleUpdated);
    await page.locator('input[type="number"]').first().fill('550'); // Update price

    await page.getByRole('button', { name: 'Сохранить изменения' }).click();

    // Verify the update in the list
    await expect(page.getByText(testMenuTitleUpdated)).toBeVisible();
  });

  test('Menu Item Integration in ProductPopup', async ({ page }) => {
    // Navigate to new KP
    await page.getByRole('button', { name: 'Новое КП', exact: true }).click();

    // Click Add Product
    await page.getByTestId('kp-add-row-button').click();

    // Inside Product Popup, find the input and search for the updated menu item
    const productInput = page.getByTestId('product-name');
    await productInput.fill(testMenuTitleUpdated);

    // Wait for the suggestion and click it
    const suggestion = page.locator('.suggestion-item').filter({ hasText: testMenuTitleUpdated });
    await expect(suggestion).toBeVisible();
    await suggestion.click();

    // Verify autofill populated the fields
    await expect(page.getByTestId('product-name')).toHaveValue(testMenuTitleUpdated);
    // Price
    await expect(page.getByTestId('product-price')).toHaveValue('550');

    // Verify the fields are fully editable (not locked!)
    // Add quantity
    await page.getByTestId('product-quantity').fill('10');
    // Change price manually
    await page.getByTestId('product-price').fill('600');

    // Save product
    await page.getByTestId('product-save-button').click();

    // Verify the product was added to the row with the modified values
    await expect(page.locator(`text=${testMenuTitleUpdated}`).first()).toBeVisible();
    await expect(page.locator('text=600').first()).toBeVisible();
  });
});
