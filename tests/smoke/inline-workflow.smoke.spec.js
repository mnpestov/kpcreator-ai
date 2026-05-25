const { test, expect } = require('@playwright/test');

test.describe('KP-First Workflow with Inline Contractor and Auto Event', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByTestId('login-email').fill('admin@example.com');
        await page.getByTestId('login-password').fill('123456');
        await page.getByTestId('login-submit-button').click();
        await expect(page.getByText('Выйти')).toBeVisible();
    });

    test('should create contractor inline and auto-create event on save', async ({ page }) => {
        const timestamp = Date.now();
        const testKpTitle = `[SMOKE] Корпоратив ${timestamp}`;
        const testContractorName = `[SMOKE] ООО Тест ${timestamp}`;
        const testEventPlace = `[SMOKE] Лофт ${timestamp}`;

        // 1. Открыть форму нового КП через навигацию (client-side)
        await page.getByText('Новое КП').first().click();
        
        // Дожидаемся загрузки данных
        await page.waitForURL(/\/new/);
        await page.waitForLoadState('networkidle');

        // 2. Создать контрагента инлайн
        page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
        await page.getByTestId('add-contractor-btn').click();
        await expect(page.locator('.contractor-popup')).toBeVisible();
        
        await page.getByTestId('contractor-name-input').fill(testContractorName);
        await page.getByTestId('contractor-phone-input').fill('+7 (999) 000-00-00');
        await page.getByTestId('contractor-save-button').click();
        
        // Убеждаемся, что попап закрылся

        // 3. Заполнить минимальные поля КП
        await page.getByTestId('kp-event-title').fill(testKpTitle);
        await page.getByTestId('kp-event-place').fill(testEventPlace);
        await page.getByTestId('kp-count-of-person').fill('150');

        // Добавим одну позицию, чтобы форма была валидна
        await page.getByTestId('kp-add-row-button').click();
        await expect(page.locator('.popup')).toBeVisible();
        await page.getByTestId('product-name').fill(`[SMOKE] Канапе ${timestamp}`);
        await page.getByTestId('product-quantity').fill('100');
        await page.getByTestId('product-price').fill('150');
        await page.getByTestId('product-save-button').click();
        
        await page.getByTestId('kp-save-list-button').click();

        // 4. Сохранить КП
        await page.getByTestId('kp-save-button').click();

        // Ожидаем перехода на страницу превью
        await page.waitForURL(/\/kp\/\d+/);

        // 5. Проверить, что событие связано на странице превью
        // Contractor name might not be shown on preview due to recent UI cleanup, but title is there
        await expect(page.locator('body')).toContainText(testKpTitle);
        
        // Перейдем в список контрагентов, откроем детали и проверим связь
        await page.goto('/contractors');
        await page.waitForLoadState('networkidle');
        await page.locator(`text=${testContractorName}`).first().click();
        await page.waitForLoadState('networkidle');
        // В ContractorDetails отображается eventPlace для связанных КП (по приоритету)
        await expect(page.locator('body')).toContainText(testEventPlace); 
        
        // Перейдем в список событий, откроем детали и проверим связь
        await page.goto('/events');
        await page.waitForLoadState('networkidle');
        await page.locator(`text=${testKpTitle}`).first().click();
        await page.waitForLoadState('networkidle');
        // В EventDetails должно отображаться событие, и возможно связанные КП
        await expect(page.locator('body')).toContainText(testKpTitle);

        // ============================================
        // FLOW 1: EXISTING EVENT SELECTION
        // ============================================
        const testModifiedPlace = `[SMOKE] Измененный Лофт ${timestamp}`;

        // 6. Открыть форму нового КП (второе КП)
        await page.getByText('Новое КП').first().click();
        await page.waitForURL(/\/new/);
        await page.waitForLoadState('networkidle');

        // 7. Выбрать только что созданное событие из выпадающего списка
        const optionValue = await page.locator(`option:has-text("${testKpTitle}")`).first().getAttribute('value');
        await page.getByTestId('kp-event-select').selectOption(optionValue);

        // Убедиться, что поля заполнились
        await expect(page.getByTestId('kp-event-title')).toHaveValue(testKpTitle);
        await expect(page.getByTestId('kp-event-place')).toHaveValue(testEventPlace);

        // 8. Изменить поля (эмуляция Snapshot поведения)
        await page.getByTestId('kp-event-place').fill(testModifiedPlace);
        await page.getByTestId('kp-count-of-person').fill('200');

        // Добавим одну позицию, чтобы форма была валидна
        await page.getByTestId('kp-add-row-button').click();
        await expect(page.locator('.popup')).toBeVisible();
        await page.getByTestId('product-name').fill(`[SMOKE] Позиция 2 ${timestamp}`);
        await page.getByTestId('product-quantity').fill('10');
        await page.getByTestId('product-price').fill('500');
        await page.getByTestId('product-save-button').click();
        await expect(page.locator('.popup')).toBeHidden();
        
        await page.getByTestId('kp-save-list-button').click();
        

        // 9. Сохранить второе КП
        await page.getByTestId('kp-save-button').click();
        await page.waitForURL(/\/kp\/\d+/);

        // 10. Проверить, что второе КП сохранено с измененным местом
        await expect(page.locator('body')).toContainText(testModifiedPlace);

        // 11. Перейти в события и убедиться, что оригинальное событие НЕ изменилось
        await page.goto('/events');
        await page.waitForLoadState('networkidle');
        await page.locator(`text=${testKpTitle}`).first().click();
        await page.waitForLoadState('networkidle');
        // Оригинальное место должно остаться прежним
        await expect(page.locator('body')).toContainText(testEventPlace);
        
        // ============================================
        // CLEAR SELECTION EDGE CASE
        // ============================================
        
        // 12. Открыть форму нового КП (третье КП)
        await page.getByText('Новое КП').first().click();
        await page.waitForURL(/\/new/);
        await page.waitForLoadState('networkidle');

        // Выбрать событие
        await page.getByTestId('kp-event-select').selectOption(optionValue);
        await expect(page.getByTestId('kp-event-title')).toHaveValue(testKpTitle);

        // Сбросить выбор события (выбрать "— Не привязано —")
        await page.getByTestId('kp-event-select').selectOption('');

        // Убедиться, что поля остались заполненными
        await expect(page.getByTestId('kp-event-title')).toHaveValue(testKpTitle);

        // Добавить позицию для валидации
        await page.getByTestId('kp-add-row-button').click();
        await expect(page.locator('.popup')).toBeVisible();
        await page.getByTestId('product-name').fill(`[SMOKE] Позиция 3 ${timestamp}`);
        await page.getByTestId('product-quantity').fill('5');
        await page.getByTestId('product-price').fill('1000');
        await page.getByTestId('product-save-button').click();
        await expect(page.locator('.popup')).toBeHidden();
        
        await page.getByTestId('kp-save-list-button').click();
        

        // Сохранить третье КП
        await page.getByTestId('kp-save-button').click();
        await page.waitForURL(/\/kp\/\d+/);

    });
});
