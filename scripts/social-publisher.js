const { readJson, requestJson } = require('./runtime-utils');

async function publish(platform, payload, options = {}) {
  const config = await readJson('data/social-platforms.json');
  const item = config.platforms[platform];
  if (!item) throw new Error(`Unsupported platform: ${platform}`);
  const token = options.token || process.env[item.token_env];
  if (!token) throw new Error(`Missing ${item.token_env}`);
  if (!options.endpoint) throw new Error('A platform-specific publish endpoint is required');
  return requestJson(options.endpoint, { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(payload) });
}

module.exports = { publish };