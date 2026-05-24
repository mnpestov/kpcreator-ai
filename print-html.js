const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3001/login');
  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Пароль').fill('123456');
  await page.getByRole('button', { name: 'Войти' }).click();
  await page.waitForURL('http://localhost:3001/');
  
  await page.goto('http://localhost:3001/events/new');
  await page.waitForTimeout(1000);
  const htmlEvents = await page.content();
  console.log('--- EVENTS HTML ---');
  console.log(htmlEvents.substring(htmlEvents.indexOf('<form'), htmlEvents.indexOf('</form>') + 7));
  
  await page.goto('http://localhost:3001/new');
  await page.waitForTimeout(1000);
  const htmlForm = await page.content();
  console.log('--- FORM HTML ---');
  console.log(htmlForm.substring(htmlForm.indexOf('<div class="form__card"'), htmlForm.indexOf('<div class="form__card"') + 1500));
  
  await browser.close();
})();
