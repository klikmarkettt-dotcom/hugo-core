const { plan } = require('./planner');
const { reason } = require('./reasoner');
const { decide } = require('./cognition-decider');
const { learn } = require('./memory-learn');
const { recall } = require('./memory-recall');
const { see } = require('./vision-engine');
const { execute } = require('./automation-engine');
const { parse } = require('./voice-commands');
const { transcribe, synthesize } = require('./voice-engine');
const campaign = require('./campaign-manager');
const crm = require('./crm-manager');
const { publish } = require('./social-publisher');

async function run(action, input = {}) {
  if (action === 'plan') return plan(input.task, input.options);
  if (action === 'reason') return reason(input.problem, input.context, input.options);
  if (action === 'decide') return decide(input.state, input.options);
  if (action === 'remember') return learn(input.text, input.metadata);
  if (action === 'recall') return recall(input.query, input.options);
  if (action === 'see') return see(input.url, input.options);
  if (action === 'automate') return execute(input.action, input.input, input.options);
  if (action === 'voice_command') return parse(input.text);
  if (action === 'voice_transcribe') return transcribe(input.audio, input.options);
  if (action === 'voice_synthesize') return synthesize(input.text, input.options);
  if (action === 'campaign_create') return campaign.create(input);
  if (action === 'campaign_list') return campaign.list();
  if (action === 'campaign_update') return campaign.update(input.id, input.changes);
  if (action === 'crm_add_contact') return crm.addContact(input);
  if (action === 'crm_list_contacts') return crm.listContacts();
  if (action === 'crm_add_event') return crm.addEvent(input);
  if (action === 'social_publish') return publish(input.platform, input.payload, input.options);
  throw new Error(`Unknown Hugo action: ${action}`);
}

module.exports = { run };