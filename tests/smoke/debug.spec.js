const { test, expect } = require('@playwright/test');

test('Debug Event Edit', async ({ page }) => {
  page.on('response', async res => {
    if ((res.request().method() === 'POST' || res.request().method() === 'PUT') && res.url().includes('events')) {
      console.log('RESPONSE:', res.status(), res.url(), await res.text());
    }
  });

  await page.goto('/login');
  await page.getByTestId('login-email').fill('admin@example.com');
  await page.getByTestId('login-password').fill('123456');
  await page.getByTestId('login-submit-button').click();
  await page.waitForURL('/');

  await page.getByText('События').first().click();
  await page.waitForURL(/\/events/);
  await page.getByRole('button', { name: 'Создать событие' }).click();
  
  await page.getByTestId('event-title').fill('[SMOKE] Edit Event');
  await page.getByTestId('event-date').fill('2025-01-01');
  await page.getByTestId('event-save-button').click();
  
  await page.waitForURL(/\/events\/\d+/);
  const eventUrl = page.url();
  const id = eventUrl.split('/').pop();

  await page.goto(`/events/${id}/edit`);
  await page.getByTestId('event-date').fill('2025-02-02');
  await page.getByTestId('event-save-button').click();

  await page.waitForTimeout(2000);
});
