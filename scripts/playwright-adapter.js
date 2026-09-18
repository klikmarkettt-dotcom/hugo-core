async function loadPlaywright() {
  try {
    return require('playwright');
  } catch (error) {
    throw new Error(`Playwright is optional and not installed: ${error.message}`);
  }
}

async function open(url, options = {}) {
  const playwright = await loadPlaywright();
  const browser = await playwright[options.browser || 'chromium'].launch({ headless: options.headless !== false });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: options.waitUntil || 'domcontentloaded', timeout: options.timeoutMs || 30000 });
    return { url: page.url(), title: await page.title(), html: await page.content() };
  } finally {
    await browser.close();
  }
}

async function screenshot(url, outputPath, options = {}) {
  const playwright = await loadPlaywright();
  const browser = await playwright[options.browser || 'chromium'].launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: options.viewport || { width: 1280, height: 720 } });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: options.timeoutMs || 30000 });
    await page.screenshot({ path: outputPath, fullPage: options.fullPage !== false });
    return { url: page.url(), outputPath };
  } finally {
    await browser.close();
  }
}

module.exports = { open, screenshot };