const { readJson } = require('./runtime-utils');

async function list() { return (await readJson('data/mcp-config.json', { servers: [] })).servers; }
async function find(name) { return (await list()).find((server) => server.name === name || server.id === name) || null; }

module.exports = { find, list };