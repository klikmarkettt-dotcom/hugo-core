const { requestJson } = require('./runtime-utils');

async function navigate(url, actions = [], options = {}) {
  if (!Array.isArray(actions)) throw new TypeError('actions must be an array');
  if (!options.endpoint) throw new Error('A browser backend endpoint is required for navigation');
  return requestJson(options.endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'navigate', url, actions, options }) });
}

module.exports = { navigate };