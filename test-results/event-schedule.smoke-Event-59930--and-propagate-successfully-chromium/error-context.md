# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: event-schedule.smoke.spec.js >> Event Schedule Domain Correction Smoke Test >> should create multi-day event, edit it, select in KP, and propagate successfully
- Location: tests/smoke/event-schedule.smoke.spec.js:15:3

# Error details

```
Error: expect(locator).toHaveValue(expected) failed

Locator: getByTestId('kp-start-event-date').locator('input[type="text"]')
Expected: "01.05.2025"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveValue" with timeout 5000ms
  - waiting for getByTestId('kp-start-event-date').locator('input[type="text"]')

```

```yaml
- complementary:
  - strong: KpCreator
  - navigation:
    - button "Список КП"
    - button "Новое КП"
    - button "Контрагенты"
    - button "События"
    - button "Меню"
    - button "Личный кабинет"
    - button "Справочники скоро" [disabled]
  - button "Выйти"
- banner: T Test Admin
- heading "Новое коммерческое предложение" [level=1]
- paragraph: Заполните основные данные, сведения о мероприятии, логистике и добавьте позиции КП
- button "На главную":
  - img
  - text: На главную
- heading "Основная информация" [level=3]
- text: Номер коммерческого предложения
- textbox "Номер коммерческого предложения": "576"
- text: Дата коммерческого предложения
- textbox
- text: № договора
- textbox "№ договора": MULTI-01
- text: Дата договора
- textbox
- heading "Данные мероприятия" [level=3]
- text: Дата начала
- textbox
- text: Время начала
- textbox "Время начала": 10:00
- text: Время окончания
- textbox "Время окончания": 20:00
- text: Дата окончания
- textbox
- text: Время начала
- textbox "Время начала": 09:00
- text: Время окончания
- textbox "Время окончания": 18:00
- text: Контрагент
- button "Контрагент": — Не выбран —
- button:
  - img
- text: Связь с событием
- combobox "Связь с событием":
  - option "— Новое событие —"
  - option "[SMOKE] Propagation Event (2025-01-01)"
  - option "[SMOKE] Propagation Event (2025-01-01)"
  - option "[SMOKE] Propagation Event (2025-01-01)"
  - option "[SMOKE] Propagation Event (2025-02-02)"
  - option "[SMOKE] Multi-day Event (2025-05-01)" [selected]
  - option "[SMOKE] Multi-day Event (2025-05-01)"
  - option "[SMOKE] Multi-day Event (2025-05-01)"
  - option "[SMOKE] Multi-day Event (2025-05-01)"
  - option "[SMOKE] Multi-day Event (2025-05-01)"
  - option "СтритФуд (2026-05-25)"
  - option "[SMOKE] Корпоратив 1779730731634 (2026-05-25)"
  - option "[SMOKE] Корпоратив 1779730731634 (2026-05-25)"
  - option "[SMOKE] Корпоратив 1779730796615 (2026-05-25)"
  - option "[SMOKE] Корпоратив 1779730796615 (2026-05-25)"
  - option "[SMOKE] Корпоратив 1779732334923 (2026-05-25)"
  - option "[SMOKE] Корпоратив 1779732334923 (2026-05-25)"
  - option "[SMOKE] Корпоратив 1779733069183 (2026-05-25)"
  - option "[SMOKE] Корпоратив 1779733069183 (2026-05-25)"
  - option "Лето в москве (2026-05-30)"
- text: Место проведения
- textbox "Место проведения"
- text: Кол-во персон
- spinbutton "Кол-во персон"
- text: Название мероприятия
- textbox "Название мероприятия": "[SMOKE] Multi-day Event"
- heading "Логистика" [level=3]
- text: В пределах МКАД?
- radiogroup "В пределах МКАД":
  - radio [checked]
  - radio
- text: Стоимость логистики
- spinbutton "Стоимость логистики": "0"
- heading "Состав КП" [level=3]
- button "Сохранить лист Достигнуто максимальное количество продуктов на одном листе":
  - img
  - text: Добавить позицию
- button "Сохранить лист"
- text: Достигнуто максимальное количество продуктов на одном листе
- button "Сохранить коммерческое предложение" [disabled]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Event Schedule Domain Correction Smoke Test', () => {
  4  |   let eventId = null;
  5  |   let kpNumber = null;
  6  | 
  7  |   test.beforeEach(async ({ page }) => {
  8  |     await page.goto('/login');
  9  |     await page.getByTestId('login-email').fill('admin@example.com');
  10 |     await page.getByTestId('login-password').fill('123456');
  11 |     await page.getByTestId('login-submit-button').click();
  12 |     await page.waitForURL('/');
  13 |   });
  14 | 
  15 |   test('should create multi-day event, edit it, select in KP, and propagate successfully', async ({ page }) => {
  16 |     // 1. Create multi-day event
  17 |     await page.getByText('События').first().click();
  18 |     await page.waitForURL(/\/events/);
  19 |     await page.getByRole('button', { name: 'Создать событие' }).click();
  20 |     await page.getByTestId('event-title').fill('[SMOKE] Multi-day Event');
  21 |     
  22 |     // Fill first day
  23 |     await page.getByTestId('event-date').fill('2025-05-01'); // maps to startEvent
  24 |     
  25 |     await page.getByTestId('event-start-time-start').fill('10:00');
  26 |     await page.getByTestId('event-end-time-start').fill('20:00');
  27 | 
  28 |     // Fill last day
  29 |     await page.getByTestId('event-end-date').fill('2025-05-03');
  30 |     await page.getByTestId('event-start-time-end').fill('09:00');
  31 |     await page.getByTestId('event-end-time-end').fill('18:00');
  32 |     
  33 |     await page.getByTestId('event-save-button').click();
  34 |     await page.waitForURL(/\/events\/\d+/);
  35 |     
  36 |     const eventUrl = page.url();
  37 |     eventId = eventUrl.split('/').pop();
  38 | 
  39 |     // 2. Select Event into KP and check mapping
  40 |     await page.getByText('Новое КП').first().click();
  41 |     await page.waitForURL(/\/new|\/create/);
  42 |     await page.getByTestId('kp-contract-number').fill('MULTI-01');
  43 |     
  44 |     // Select the event
  45 |     await page.getByTestId('kp-event-select').selectOption({ label: `[SMOKE] Multi-day Event (2025-05-01)` });
  46 | 
  47 |     // Assert the KP form is populated correctly!
> 48 |     await expect(page.getByTestId('kp-start-event-date').locator('input[type="text"]')).toHaveValue('01.05.2025');
     |                                                                                         ^ Error: expect(locator).toHaveValue(expected) failed
  49 |     // For end date we didn't add test id, let's use label
  50 |     await expect(page.locator('div.form__field', { has: page.locator('label:has-text("Дата окончания")') }).locator('input[type="text"]')).toHaveValue('03.05.2025');
  51 |     
  52 |     await expect(page.getByLabel('Время начала').first()).toHaveValue('10:00');
  53 |     // Note: The UI for time inputs varies, but we assume it maps correctly.
  54 | 
  55 |     // Fill minimum KP data to save
  56 |     await page.getByTestId('kp-count-of-person').fill('100');
  57 |     await page.getByTestId('kp-logistics').fill('0');
  58 |     // Commercial data
  59 |     await page.getByTestId('kp-add-row-button').click();
  60 |     await page.getByTestId('product-name').fill('Prop Item 1');
  61 |     await page.getByTestId('product-quantity').fill('5');
  62 |     await page.getByTestId('product-price').fill('100');
  63 |     await page.getByTestId('product-save-button').click();
  64 |     await expect(page.locator('.popup')).toBeHidden();
  65 |     await page.getByTestId('kp-save-list-button').click();
  66 |     
  67 |     await page.getByTestId('kp-save-button').click();
  68 |     await page.waitForURL(/\/kp\/\d+/);
  69 |     
  70 |     kpNumber = page.url().split('/').pop();
  71 | 
  72 |     // 3. Edit Event schedule and Propagate
  73 |     await page.goto(`/events/${eventId}/edit`);
  74 |     
  75 |     // Edit last day end time
  76 |     await page.getByTestId('event-end-time-end').fill('15:00');
  77 |     
  78 |     // Accept propagation
  79 |     page.once('dialog', async dialog => {
  80 |       await dialog.accept();
  81 |     });
  82 |     
  83 |     await page.getByTestId('event-save-button').click();
  84 |     await page.waitForURL(/\/events\/\d+/);
  85 | 
  86 |     // Verify propagation
  87 |     await page.goto(`/kp/${kpNumber}/edit`);
  88 |     
  89 |     // Wait for form to load
  90 |     await expect(page.locator('div.form__field', { has: page.locator('label:has-text("Дата окончания")') }).locator('input[type="text"]')).toHaveValue('03.05.2025');
  91 |   });
  92 | });
  93 | 
```