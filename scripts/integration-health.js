const { list } = require('./integration-registry');

async function check(category) {
  const adapters = await list(category);
  return Promise.all(adapters.map(async (adapter) => {
    if (!adapter.endpoint) return { id: adapter.id, status: 'unconfigured', transport: adapter.transport };
    try {
      const url = new URL(adapter.healthPath || '/', adapter.endpoint).toString();
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
      return { id: adapter.id, status: response.ok ? 'reachable' : `http-${response.status}`, endpoint: adapter.endpoint };
    } catch (error) {
      return { id: adapter.id, status: 'unreachable', endpoint: adapter.endpoint, error: error.message };
    }
  }));
}

async function main() {
  const results = await check(process.argv[2]);
  const counts = results.reduce((summary, result) => {
    summary[result.status] = (summary[result.status] || 0) + 1;
    return summary;
  }, {});
  console.log(JSON.stringify({ checkedAt: new Date().toISOString(), counts, integrations: results }, null, 2));
}

if (require.main === module) main().catch((error) => {
  console.error(`[integration-health] ${error.message}`);
  process.exitCode = 1;
});

module.exports = { check };