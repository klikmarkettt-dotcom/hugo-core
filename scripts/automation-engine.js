const { requestJson } = require('./runtime-utils');

async function execute(action, input = {}, options = {}) {
  if (!action || typeof action !== 'string') throw new TypeError('action is required');
  if (action === 'http') return requestJson(input.url, { method: input.method || 'GET', headers: input.headers, body: input.body && JSON.stringify(input.body) });
  if (action === 'webhook') return requestJson(input.url, { method: 'POST', headers: { 'content-type': 'application/json', ...(input.headers || {}) }, body: JSON.stringify(input.body || {}) });
  if (action === 'memory') return { action, status: 'delegated', input };
  if (action === 'shell') throw new Error('Shell execution requires an explicit trusted runner');
  throw new Error(`Unsupported automation action: ${action}`);
}

module.exports = { execute };