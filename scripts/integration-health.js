const { list } = require('./integration-registry');

async function check(category) {
  const adapters = await list(category);
  return Promise.all(adapters.map(async (adapter) => {
    if (!adapter.endpoint) return { id: adapter.id, status: 'unconfigured', transport: adapter.transport };
    try {
      const response = await fetch(adapter.endpoint, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
      return { id: adapter.id, status: response.ok ? 'reachable' : `http-${response.status}`, endpoint: adapter.endpoint };
    } catch (error) {
      return { id: adapter.id, status: 'unreachable', endpoint: adapter.endpoint, error: error.message };
    }
  }));
}

module.exports = { check };