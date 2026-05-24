const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3001/login');
  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Пароль').fill('123456');
  await page.getByRole('button', { name: 'Войти' }).click();
  await page.waitForURL('http://localhost:3001/');
  console.log('Logged in, URL is:', page.url());
  
  // Click on Sidebar or header to navigate
  await page.getByText('Создать КП').first().click();
  await page.waitForTimeout(2000);
  console.log('Went to create via click, URL is:', page.url());
  await browser.close();
})();
