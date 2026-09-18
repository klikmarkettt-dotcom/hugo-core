const { requestJson } = require('./runtime-utils');

async function create(job, input, options = {}) {
  const endpoint = options.endpoint || process.env.HIGGSFIELD_API_URL;
  const token = options.token || process.env.HIGGSFIELD_API_KEY;
  if (!endpoint || !token) throw new Error('HIGGSFIELD_API_URL and HIGGSFIELD_API_KEY are required');
  return requestJson(endpoint, { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify({ job, input }) });
}

async function status(jobId, options = {}) {
  const endpoint = options.endpoint || process.env.HIGGSFIELD_API_URL;
  const token = options.token || process.env.HIGGSFIELD_API_KEY;
  if (!endpoint || !token || !jobId) throw new Error('Higgsfield endpoint, token, and jobId are required');
  return requestJson(`${endpoint.replace(/\/$/, '')}/${encodeURIComponent(jobId)}`, { headers: { authorization: `Bearer ${token}` } });
}

module.exports = { create, status };