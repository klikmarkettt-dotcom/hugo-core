const http = require('node:http');
const { readJson } = require('./runtime-utils');
const { plan } = require('./planner');
const { learn } = require('./memory-learn');
const { recall } = require('./memory-recall');
const { read } = require('./screen-read');

function authorized(request, token) {
  const provided = request.headers.authorization || '';
  return token && provided === `Bearer ${token}`;
}

async function dispatch(action, input = {}) {
  if (action === 'health') return { status: 'ok', device: 'pc', time: new Date().toISOString() };
  if (action === 'plan') return plan(input.task, input.options);
  if (action === 'remember') return learn(input.text, input.metadata);
  if (action === 'recall') return recall(input.query, input.options);
  if (action === 'browser_read') return read(input.url, input.options);
  if (action === 'pc_control') {
    const endpoint = process.env.HUGO_PC_CONTROL_ENDPOINT;
    if (!endpoint) throw new Error('HUGO_PC_CONTROL_ENDPOINT is not configured');
    const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) });
    if (!response.ok) throw new Error(`PC control backend returned HTTP ${response.status}`);
    return response.json();
  }
  throw new Error(`Unsupported device action: ${action}`);
}

function start(options = {}) {
  const host = options.host || process.env.HUGO_DEVICE_HOST || '127.0.0.1';
  const port = options.port || Number(process.env.HUGO_DEVICE_PORT || 8787);
  const token = options.token || process.env.HUGO_DEVICE_TOKEN;
  if (!token) throw new Error('HUGO_DEVICE_TOKEN is required');
  const server = http.createServer(async (request, response) => {
    response.setHeader('content-type', 'application/json');
    if (request.method === 'GET' && request.url === '/health') { response.end(JSON.stringify({ status: 'ok', device: 'pc' })); return; }
    if (request.method !== 'POST' || request.url !== '/command' || !authorized(request, token)) { response.writeHead(401); response.end(JSON.stringify({ error: 'unauthorized' })); return; }
    try {
      let body = '';
      for await (const chunk of request) { body += chunk; if (body.length > 1_000_000) throw new Error('request too large'); }
      const payload = JSON.parse(body);
      const result = await dispatch(payload.action, payload.input || {});
      response.end(JSON.stringify({ ok: true, result }));
    } catch (error) { response.writeHead(400); response.end(JSON.stringify({ ok: false, error: error.message })); }
  });
  server.listen(port, host);
  return server;
}

if (require.main === module) start();
module.exports = { dispatch, start };