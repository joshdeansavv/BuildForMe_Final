const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 60000 });
  await page.setViewport({ width: 1440, height: 900 });
  await page.screenshot({ path: 'homepage-screenshot.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved as homepage-screenshot.png');
})(); 