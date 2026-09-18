const { readJson, writeJson } = require('./runtime-utils');

async function link(source, target, reason = 'related') {
  if (!source || !target) throw new TypeError('source and target are required');
  const data = await readJson('memory/backlinks.json', { version: '1.0.0', links: {} });
  data.links[source] = data.links[source] || [];
  if (!data.links[source].some((item) => item.target === target)) data.links[source].push({ target, reason, created_at: new Date().toISOString() });
  await writeJson('memory/backlinks.json', data);
  return data.links[source];
}

async function get(source) { return (await readJson('memory/backlinks.json', { links: {} })).links[source] || []; }

module.exports = { get, link };