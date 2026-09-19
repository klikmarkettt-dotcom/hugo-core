const { requestJson } = require('./runtime-utils');

async function reason(problem, context = {}, options = {}) {
  if (!problem || typeof problem !== 'string') throw new TypeError('problem must be a non-empty string');
  const apiKey = options.apiKey || process.env.OPENAI_API_KEY || process.env.HUGO_CLOUD_AI_API_KEY || '';
  const localEndpoint = options.endpoint || process.env.HUGO_LOCAL_AI_ENDPOINT || process.env.HUGO_CLOUD_AI_ENDPOINT;
  const localProvider = process.env.HUGO_LOCAL_AI_ENDPOINT ? 'llama.cpp' : 'cloud-openai-compatible';
  const endpoint = localEndpoint || process.env.OPENAI_BASE_URL || (apiKey ? 'https://api.openai.com/v1/chat/completions' : null);
  if (!endpoint) return { provider: 'local', conclusion: problem, assumptions: [], next_actions: [] };
  const body = { model: options.model || process.env.HUGO_LOCAL_AI_MODEL || process.env.HUGO_CLOUD_AI_MODEL || process.env.HUGO_REASONING_MODEL || 'local-model', temperature: 0.2, messages: [{ role: 'system', content: 'Одговори на македонски. Врати јасно решение, претпоставки и следни дејства.' }, { role: 'user', content: JSON.stringify({ problem, context }) }] };
  try {
    const headers = { 'content-type': 'application/json' };
    if (apiKey) headers.authorization = `Bearer ${apiKey}`;
    const data = await requestJson(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });
    return { provider: localEndpoint && !apiKey ? localProvider : 'openai-compatible', content: data.choices?.[0]?.message?.content || '', raw: data };
  } catch (error) {
    return { provider: 'error', error: error.message, fallback: problem };
  }
}

module.exports = { reason };