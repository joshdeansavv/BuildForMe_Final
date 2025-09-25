const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 60000 });
  await page.setViewport({ width: 1440, height: 900 });
  await page.screenshot({ path: 'SCREENSHOTS/homepage-screenshot.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved as SCREENSHOTS/homepage-screenshot.png');
})(); 