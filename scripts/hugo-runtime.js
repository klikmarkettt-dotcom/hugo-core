const { plan } = require('./planner');
const { reason } = require('./reasoner');
const { decide } = require('./cognition-decider');
const { learn } = require('./memory-learn');
const { recall } = require('./memory-recall');
const { see } = require('./vision-engine');
const { execute } = require('./automation-engine');
const { parse } = require('./voice-commands');

async function run(action, input = {}) {
  if (action === 'plan') return plan(input.task, input.options);
  if (action === 'reason') return reason(input.problem, input.context, input.options);
  if (action === 'decide') return decide(input.state, input.options);
  if (action === 'remember') return learn(input.text, input.metadata);
  if (action === 'recall') return recall(input.query, input.options);
  if (action === 'see') return see(input.url, input.options);
  if (action === 'automate') return execute(input.action, input.input, input.options);
  if (action === 'voice_command') return parse(input.text);
  throw new Error(`Unknown Hugo action: ${action}`);
}

module.exports = { run };