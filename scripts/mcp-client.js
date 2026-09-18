const { requestJson } = require('./runtime-utils');

async function call(server, tool, arguments_, options = {}) {
  if (!server || !tool) throw new TypeError('server and tool are required');
  if (!options.endpoint) throw new Error('An MCP HTTP bridge endpoint is required');
  return requestJson(options.endpoint, { method: 'POST', headers: { 'content-type': 'application/json', ...(options.headers || {}) }, body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method: 'tools/call', params: { server, name: tool, arguments: arguments_ || {} } }) });
}

module.exports = { call };