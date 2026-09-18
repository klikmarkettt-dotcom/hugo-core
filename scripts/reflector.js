const { appendJsonl } = require('./runtime-utils');

async function reflect(task, result, expected) {
  if (!task) throw new TypeError('task is required');
  const reflection = { id: `reflection-${Date.now()}`, task, result, expected: expected ?? null, success: expected == null ? true : JSON.stringify(result) === JSON.stringify(expected), created_at: new Date().toISOString() };
  await appendJsonl('memory/learned.jsonl', { type: 'reflection', ...reflection });
  return reflection;
}

module.exports = { reflect };