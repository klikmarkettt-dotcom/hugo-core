const { readJson } = require('./runtime-utils');

async function search(before, after, limit = 50) {
  const index = await readJson('memory/temporal-index.json', { facts: {} });
  return Object.entries(index.facts).map(([id, value]) => ({ id, ...value })).filter((item) => (!before || item.learned_at <= before) && (!after || item.learned_at >= after)).sort((a, b) => b.learned_at.localeCompare(a.learned_at)).slice(0, limit);
}

module.exports = { search };