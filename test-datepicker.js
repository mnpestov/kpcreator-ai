const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  // Login first
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForSelector('nav');
  // Click "Новое КП"
  await page.click('text=Новое КП');
  await page.waitForSelector('label:has-text("Дата коммерческого предложения")');
  
  const parent = page.locator('label', { hasText: 'Дата коммерческого предложения' }).locator('..');
  const innerHTML = await parent.evaluate(el => el.innerHTML);
  console.log(innerHTML);
  await browser.close();
})();
