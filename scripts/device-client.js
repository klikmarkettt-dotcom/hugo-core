const { requestJson } = require('./runtime-utils');

async function command(endpoint, token, action, input = {}) {
  if (!endpoint || !token || !action) throw new TypeError('endpoint, token, and action are required');
  return requestJson(`${endpoint.replace(/\/$/, '')}/command`, { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify({ action, input }) });
}

async function health(endpoint, token) { return command(endpoint, token, 'health'); }

module.exports = { command, health };