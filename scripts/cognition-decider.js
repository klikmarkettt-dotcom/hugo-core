const { reason } = require('./reasoner');

async function decide(state, options = {}) {
  if (!state || typeof state !== 'object') throw new TypeError('state is required');
  const pending = (state.steps || []).filter((step) => step.status === 'pending');
  if (!pending.length) return { action: 'complete', reason: 'no pending steps' };
  if (options.useReasoner) return { action: 'reason', step: pending[0], analysis: await reason(pending[0].description, state, options) };
  return { action: 'execute', step: pending[0], reason: 'next dependency-ready step' };
}

module.exports = { decide };