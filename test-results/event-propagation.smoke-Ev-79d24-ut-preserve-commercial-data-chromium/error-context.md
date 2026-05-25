# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: event-propagation.smoke.spec.js >> Event Logistics Propagation Smoke Test >> should propagate logistics to multiple KPs but preserve commercial data
- Location: tests/smoke/event-propagation.smoke.spec.js:8:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=02.02').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=02.02').first()

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
- heading "Предпросмотр КП № 574" [level=1]
- button "Скачать PDF":
  - img
  - text: Скачать PDF
- button "Скачать спецификацию":
  - img
  - text: Скачать спецификацию
- text: "Статус:"
- button "Черновик"
- img "logo"
- heading "Коммерческое предложение № 574 от 25.05.2026 к договору №PROP-01 от 25.05.2026" [level=1]:
  - paragraph: Коммерческое предложение № 574 от 25.05.2026
  - paragraph: к договору №PROP-01 от 25.05.2026
- paragraph: Test Admin
- paragraph: admin
- paragraph: admin@example.com
- paragraph
- img "manager"
- img "logo"
- heading "[SMOKE] Propagation Event" [level=2]
- table:
  - rowgroup:
    - 'row "место: Initial Place кол-во персон: 10 человек время мероприятия: 01.01 (21:30 - 21:30) – 01.01 (21:30 - 21:30) Количество, шт Стоимость Цена, руб"':
      - 'columnheader "место: Initial Place кол-во персон: 10 человек время мероприятия: 01.01 (21:30 - 21:30) – 01.01 (21:30 - 21:30)"':
        - paragraph: "место: Initial Place"
        - paragraph: "кол-во персон: 10 человек"
        - paragraph: "время мероприятия:"
        - paragraph: 01.01 (21:30 - 21:30) – 01.01 (21:30 - 21:30)
      - columnheader "Количество, шт"
      - columnheader "Стоимость"
      - columnheader "Цена, руб"
  - rowgroup:
    - row "Prop Item 1 5 100 500":
      - cell "Prop Item 1":
        - paragraph: Prop Item 1
      - cell "5"
      - cell "100"
      - cell "500"
- paragraph: "*В стоимость включены все расходники."
- paragraph: "Итоговая сумма: 500 руб"
- button "Удалить лист":
  - img
  - text: Удалить лист
- button "Добавить товар":
  - img
  - text: Добавить товар
- img "logo"
- heading "[SMOKE] Propagation Event" [level=2]
- table:
  - rowgroup:
    - 'row "место: Initial Place кол-во персон: 10 время мероприятия: 01.01 (21:30 - 21:30) – 01.01 (21:30 - 21:30) Количество, шт"':
      - 'columnheader "место: Initial Place кол-во персон: 10 время мероприятия: 01.01 (21:30 - 21:30) – 01.01 (21:30 - 21:30)"':
        - paragraph: "место: Initial Place"
        - paragraph: "кол-во персон: 10"
        - paragraph: "время мероприятия:"
        - paragraph: 01.01 (21:30 - 21:30) – 01.01 (21:30 - 21:30)
      - columnheader "Количество, шт"
  - rowgroup:
    - row "Prop Item 1 5":
      - cell "Prop Item 1":
        - paragraph: Prop Item 1
      - cell "5"
- img "logo"
- heading "Расчёт:" [level=2]
- paragraph: "Выход на персону:"
- list
- paragraph: "Итого: 500 руб"
- paragraph: "Итого по безналичному расчёту: 535 руб"
```

# Test source

```ts
  5   |   let createdKp1Number = null;
  6   |   let createdKp2Number = null;
  7   | 
  8   |   test('should propagate logistics to multiple KPs but preserve commercial data', async ({ page }) => {
  9   |     // 1. Login
  10  |     await page.goto('/login');
  11  |     await page.getByTestId('login-email').fill('admin@example.com');
  12  |     await page.getByTestId('login-password').fill('123456');
  13  |     await page.getByTestId('login-submit-button').click();
  14  |     await page.waitForURL('/');
  15  | 
  16  |     // 2. Create Event
  17  |     await page.getByText('События').first().click();
  18  |     await page.waitForURL(/\/events/);
  19  |     await page.getByRole('button', { name: 'Создать событие' }).click();
  20  |     await page.getByTestId('event-title').fill('[SMOKE] Propagation Event');
  21  |     await page.getByTestId('event-date').fill('2025-01-01');
  22  |     await page.getByTestId('event-location').fill('Initial Place');
  23  |     await page.getByTestId('event-save-button').click();
  24  |     
  25  |     await page.waitForURL(/\/events\/\d+/);
  26  |     const eventUrl = page.url();
  27  |     createdEventId = eventUrl.split('/').pop();
  28  | 
  29  |     // 3. Create KP 1 linked to Event
  30  |     await page.getByText('Новое КП').first().click();
  31  |     await page.waitForURL(/\/new|\/create/);
  32  |     await page.getByTestId('kp-contract-number').fill('PROP-01');
  33  |     await page.getByTestId('kp-event-select').selectOption({ label: `[SMOKE] Propagation Event (2025-01-01)` });
  34  |     await page.getByTestId('kp-count-of-person').fill('10');
  35  |     await page.getByTestId('kp-logistics').fill('0');
  36  |     // Commercial data
  37  |     await page.getByTestId('kp-add-row-button').click();
  38  |     await page.getByTestId('product-name').fill('Prop Item 1');
  39  |     await page.getByTestId('product-quantity').fill('5');
  40  |     await page.getByTestId('product-price').fill('100');
  41  |     await page.getByTestId('product-save-button').click();
  42  |     await expect(page.locator('.popup')).toBeHidden();
  43  |     await page.getByTestId('kp-save-list-button').click();
  44  |     
  45  |     await page.getByTestId('kp-save-button').click();
  46  |     await page.waitForURL(/\/kp\/\d+/);
  47  |     const kp1Url = page.url();
  48  |     createdKp1Number = kp1Url.split('/').pop();
  49  | 
  50  |     // 4. Create KP 2 linked to Event
  51  |     await page.getByText('Новое КП').first().click();
  52  |     await page.waitForURL(/\/new|\/create/);
  53  |     await page.getByTestId('kp-contract-number').fill('PROP-02');
  54  |     await page.getByTestId('kp-event-select').selectOption({ label: `[SMOKE] Propagation Event (2025-01-01)` });
  55  |     await page.getByTestId('kp-count-of-person').fill('20');
  56  |     await page.getByTestId('kp-logistics').fill('0');
  57  |     // Commercial data
  58  |     await page.getByTestId('kp-add-row-button').click();
  59  |     await page.getByTestId('product-name').fill('Prop Item 2');
  60  |     await page.getByTestId('product-quantity').fill('10');
  61  |     await page.getByTestId('product-price').fill('200');
  62  |     await page.getByTestId('product-save-button').click();
  63  |     await expect(page.locator('.popup')).toBeHidden();
  64  |     await page.getByTestId('kp-save-list-button').click();
  65  |     
  66  |     await page.getByTestId('kp-save-button').click();
  67  |     await page.waitForURL(/\/kp\/\d+/);
  68  |     const kp2Url = page.url();
  69  |     createdKp2Number = kp2Url.split('/').pop();
  70  | 
  71  |     // 5. Edit Event - DECLINE propagation
  72  |     await page.goto(`/events/${createdEventId}/edit`);
  73  |     await page.getByTestId('event-date').fill('2025-02-02');
  74  |     
  75  |     // Set up dialog handler for DECLINE
  76  |     page.once('dialog', async dialog => {
  77  |       expect(dialog.message()).toContain('Обновить дату/тайминг/адрес');
  78  |       await dialog.dismiss();
  79  |     });
  80  |     
  81  |     await page.getByTestId('event-save-button').click();
  82  |     await page.waitForURL(/\/events\/\d+/);
  83  | 
  84  |     // Verify KP 1 is NOT updated
  85  |     await page.goto(`/kp/${createdKp1Number}`);
  86  |     await expect(page.locator('text=02.02').first()).not.toBeVisible();
  87  |     await expect(page.locator('text=01.01').first()).toBeVisible();
  88  | 
  89  |     // 6. Edit Event - ACCEPT propagation
  90  |     await page.goto(`/events/${createdEventId}/edit`);
  91  |     await page.getByTestId('event-location').fill('Updated Place');
  92  |     
  93  |     // Set up dialog handler for ACCEPT
  94  |     page.once('dialog', async dialog => {
  95  |       expect(dialog.message()).toContain('Обновить дату/тайминг/адрес');
  96  |       await dialog.accept();
  97  |     });
  98  |     
  99  |     await page.getByTestId('event-save-button').click();
  100 |     await page.waitForURL(/\/events\/\d+/);
  101 | 
  102 |     // 7. Verify KP 1 IS updated and commercial data preserved
  103 |     await page.goto(`/kp/${createdKp1Number}`);
  104 |     // KP header logistics
> 105 |     await expect(page.locator('text=02.02').first()).toBeVisible();
      |                                                      ^ Error: expect(locator).toBeVisible() failed
  106 |     await expect(page.locator('text=Updated Place').first()).toBeVisible();
  107 |     // Legacy List logistics (assuming they are visible in preview)
  108 |     // Commercial data preserved
  109 |     await expect(page.locator('text=Prop Item 1').first()).toBeVisible();
  110 | 
  111 |     // 8. Verify KP 2 IS updated and commercial data preserved
  112 |     await page.goto(`/kp/${createdKp2Number}`);
  113 |     await expect(page.locator('text=02.02').first()).toBeVisible();
  114 |     await expect(page.locator('text=Updated Place').first()).toBeVisible();
  115 |     await expect(page.locator('text=Prop Item 2').first()).toBeVisible();
  116 |   });
  117 | });
  118 | 
```