const { browse, screenshot } = require('./browser-control');
const { extract } = require('./screen-read');

async function see(url, options = {}) {
  const page = await browse(url, options);
  return { ...page, parsed: extract(page.html) };
}

async function capture(url, options = {}) { return screenshot(url, options); }

async function clickText(url, text, options = {}) {
  if (!text) throw new TypeError('text is required');
  const endpoint = options.endpoint || process.env.HUGO_BROWSER_ENDPOINT;
  if (!endpoint) throw new Error('A browser backend endpoint is required for click_text');
  return require('./runtime-utils').requestJson(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'click_text', url, text, options }) });
}

module.exports = { capture, clickText, see };