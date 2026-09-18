const { requestJson } = require('./runtime-utils');

async function reason(problem, context = {}, options = {}) {
  if (!problem || typeof problem !== 'string') throw new TypeError('problem must be a non-empty string');
  const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) return { provider: 'local', conclusion: problem, assumptions: [], next_actions: [] };
  const endpoint = options.endpoint || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions';
  const body = { model: options.model || process.env.HUGO_REASONING_MODEL || 'gpt-4o-mini', temperature: 0.2, messages: [{ role: 'system', content: 'Одговори на македонски. Врати јасно решение, претпоставки и следни дејства.' }, { role: 'user', content: JSON.stringify({ problem, context }) }] };
  try {
    const data = await requestJson(endpoint, { method: 'POST', headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' }, body: JSON.stringify(body) });
    return { provider: 'openai-compatible', content: data.choices?.[0]?.message?.content || '', raw: data };
  } catch (error) {
    return { provider: 'error', error: error.message, fallback: problem };
  }
}

module.exports = { reason };