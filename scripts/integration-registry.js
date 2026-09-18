const { readJson } = require('./runtime-utils');

async function list(category) {
  const registry = await readJson('data/integration-adapters.json', { adapters: [] });
  return category ? registry.adapters.filter((adapter) => adapter.category === category) : registry.adapters;
}

async function resolve(id, env = process.env) {
  const adapter = (await list()).find((item) => item.id === id);
  if (!adapter) return null;
  return { ...adapter, endpoint: adapter.env ? env[adapter.env] || adapter.endpoint || null : adapter.endpoint || null };
}

module.exports = { list, resolve };