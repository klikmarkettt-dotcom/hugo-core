const { requestJson } = require('./runtime-utils');

async function browse(url, options = {}) {
  const parsed = new URL(url);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new TypeError('only HTTP(S) URLs are supported');
  if (options.endpoint) return requestJson(options.endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'browse', url, options }) });
  const response = await fetch(url, { headers: { 'user-agent': 'Hugo-Core/1.0' } });
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${url}`);
  return { url, status: response.status, content_type: response.headers.get('content-type'), html: await response.text() };
}

async function screenshot(url, options = {}) {
  if (!options.endpoint) throw new Error('A browser backend endpoint is required for screenshots');
  return requestJson(options.endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'screenshot', url, options }) });
}

module.exports = { browse, screenshot };