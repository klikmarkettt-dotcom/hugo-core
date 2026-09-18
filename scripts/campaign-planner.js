const { readJson } = require('./runtime-utils');

async function createCampaign(templateId, name, audience = {}) {
  const data = await readJson('data/campaign-templates.json');
  const template = data.templates.find((item) => item.id === templateId);
  if (!template) throw new Error(`Unknown campaign template: ${templateId}`);
  return { id: `campaign-${Date.now()}`, name, template_id: templateId, audience, steps: template.steps.map((step) => ({ name: step, status: 'pending' })), created_at: new Date().toISOString() };
}

module.exports = { createCampaign };