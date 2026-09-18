const { execute } = require('./automation-engine');

async function runWorkflow(workflow, context = {}) {
  if (!workflow || !Array.isArray(workflow.steps)) throw new TypeError('workflow.steps must be an array');
  const results = [];
  for (const step of workflow.steps) results.push(await execute(step.action, { ...step.input, context }));
  return { id: workflow.id || `workflow-${Date.now()}`, results, completed_at: new Date().toISOString() };
}

module.exports = { runWorkflow };