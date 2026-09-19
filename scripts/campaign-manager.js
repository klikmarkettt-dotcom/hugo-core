const crypto = require('node:crypto');
const { appendJsonl, readJson, readJsonl } = require('./runtime-utils');

const STORE = 'memory/campaigns.jsonl';

async function create(input = {}) {
  if (!input.name || typeof input.name !== 'string') throw new TypeError('campaign name is required');
  const templates = await readJson('data/campaign-templates.json', { templates: [] });
  const template = templates.templates.find((item) => item.id === (input.template_id || 'launch'));
  if (!template) throw new Error(`Unknown campaign template: ${input.template_id}`);
  const campaign = {
    type: 'campaign',
    id: `campaign-${crypto.randomUUID()}`,
    name: input.name,
    brief: input.brief || '',
    audience: input.audience || {},
    channels: input.channels || [],
    template_id: template.id,
    steps: template.steps.map((name) => ({ name, status: 'pending' })),
    status: 'draft',
    created_at: new Date().toISOString(),
  };
  await appendJsonl(STORE, campaign);
  return campaign;
}

async function list() {
  const latest = new Map();
  for (const item of (await readJsonl(STORE)).filter((entry) => entry.type === 'campaign')) latest.set(item.id, item);
  return [...latest.values()];
}

async function update(id, changes = {}) {
  if (!id) throw new TypeError('campaign id is required');
  const campaigns = await list();
  const campaign = campaigns.find((item) => item.id === id);
  if (!campaign) throw new Error(`Campaign not found: ${id}`);
  const next = { ...campaign, ...changes, id, type: 'campaign', updated_at: new Date().toISOString() };
  if (Array.isArray(changes.steps)) next.steps = changes.steps;
  await appendJsonl(STORE, next);
  return next;
}

module.exports = { create, list, update };