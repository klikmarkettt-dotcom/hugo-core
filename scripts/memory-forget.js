const fs = require('node:fs/promises');
const { ROOT, readJson, writeJson } = require('./runtime-utils');

async function forget(factId) {
  if (!factId) throw new TypeError('factId is required');
  const source = `${ROOT}/memory/facts.jsonl`;
  const content = await fs.readFile(source, 'utf8').catch((error) => { if (error.code === 'ENOENT') return ''; throw error; });
  const records = content.split('\n').filter(Boolean).map(JSON.parse);
  const remaining = records.filter((record) => record.id !== factId);
  await fs.writeFile(source, remaining.length ? `${remaining.map(JSON.stringify).join('\n')}\n` : '', 'utf8');
  const temporal = await readJson('memory/temporal-index.json', { version: '1.0.0', facts: {} });
  delete temporal.facts[factId];
  await writeJson('memory/temporal-index.json', temporal);
  const backlinks = await readJson('memory/backlinks.json', { version: '1.0.0', links: {} });
  delete backlinks.links[factId];
  for (const key of Object.keys(backlinks.links)) backlinks.links[key] = backlinks.links[key].filter((link) => link.target !== factId);
  await writeJson('memory/backlinks.json', backlinks);
  return records.length !== remaining.length;
}

module.exports = { forget };