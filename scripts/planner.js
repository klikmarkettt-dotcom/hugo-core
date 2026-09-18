const { appendJsonl, readJson } = require('./runtime-utils');

function decompose(task, options = {}) {
  if (typeof task !== 'string' || !task.trim()) throw new TypeError('task must be a non-empty string');
  const steps = (options.steps || task.split(/\s*(?:;|\band then\b|\bпотоа\b)\s*/i))
    .map((description, index) => ({ id: `step-${index + 1}`, description: description.trim(), status: 'pending', depends_on: index ? [`step-${index}`] : [] }))
    .filter((step) => step.description);
  return { id: `plan-${Date.now()}`, task: task.trim(), steps, status: 'planned', created_at: new Date().toISOString() };
}

async function plan(task, options = {}) {
  const result = decompose(task, options);
  await appendJsonl('memory/conversations.jsonl', { type: 'plan', ...result });
  return result;
}

async function config() { return readJson('data/cognition.json'); }

module.exports = { config, decompose, plan };