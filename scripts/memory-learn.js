const crypto = require('node:crypto');
const { appendJsonl, readJson, writeJson } = require('./runtime-utils');

function idFor(text) { return crypto.createHash('sha256').update(text).digest('hex').slice(0, 16); }

async function learn(text, metadata = {}) {
  if (typeof text !== 'string' || !text.trim()) throw new TypeError('text must be non-empty');
  const now = new Date().toISOString();
  const fact = { id: idFor(text.trim()), text: text.trim(), source: metadata.source || 'user', confidence: metadata.confidence ?? 1, learned_at: now, updated_at: now, tags: metadata.tags || [] };
  await appendJsonl('memory/facts.jsonl', fact);
  const temporal = await readJson('memory/temporal-index.json', { version: '1.0.0', facts: {} });
  temporal.facts[fact.id] = { learned_at: now, updated_at: now };
  await writeJson('memory/temporal-index.json', temporal);
  return fact;
}

module.exports = { idFor, learn };