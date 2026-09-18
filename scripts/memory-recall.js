const { readJsonl } = require('./runtime-utils');

function score(record, terms, before) {
  const haystack = `${record.text || ''} ${(record.tags || []).join(' ')}`.toLowerCase();
  const keyword = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
  const temporal = before && record.learned_at && record.learned_at <= before ? 0.25 : 0;
  return keyword + temporal;
}

async function recall(query, options = {}) {
  if (typeof query !== 'string' || !query.trim()) throw new TypeError('query must be non-empty');
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const facts = await readJsonl('memory/facts.jsonl');
  return facts.map((fact) => ({ ...fact, score: score(fact, terms, options.before) })).filter((fact) => fact.score > 0).sort((a, b) => b.score - a.score).slice(0, options.limit || 10);
}

module.exports = { recall };