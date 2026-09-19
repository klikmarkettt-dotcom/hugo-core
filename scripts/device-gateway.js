const http = require('node:http');
const { plan } = require('./planner');
const { reason } = require('./reasoner');
const { decide } = require('./cognition-decider');
const { learn } = require('./memory-learn');
const { recall } = require('./memory-recall');
const { see } = require('./vision-engine');
const { execute } = require('./automation-engine');
const { parse } = require('./voice-commands');
const { transcribe, synthesize } = require('./voice-engine');

function authorized(request, token) {
  const provided = request.headers.authorization || '';
  return token && provided === `Bearer ${token}`;
}

async function dispatch(action, input = {}) {
  if (action === 'health') return { status: 'ok', device: 'pc', time: new Date().toISOString() };
  if (action === 'plan') return plan(input.task, input.options);
  if (action === 'reason') return reason(input.problem, input.context, input.options);
  if (action === 'decide') return decide(input.state, input.options);
  if (action === 'remember') return learn(input.text, input.metadata);
  if (action === 'recall') return recall(input.query, input.options);
  if (action === 'see') return see(input.url, input.options);
  if (action === 'automate') return execute(input.action, input.input, input.options);
  if (action === 'voice_command') return parse(input.text);
  if (action === 'voice_transcribe') return transcribe(input.audio, { ...input.options, endpoint: input.options?.endpoint || process.env.HUGO_STT_ENDPOINT, token: input.options?.token || process.env.HUGO_STT_TOKEN });
  if (action === 'voice_synthesize') return synthesize(input.text, { ...input.options, endpoint: input.options?.endpoint || process.env.HUGO_TTS_ENDPOINT, token: input.options?.token || process.env.HUGO_TTS_TOKEN });
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