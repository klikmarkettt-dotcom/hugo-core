const crypto = require('node:crypto');
const { appendJsonl, readJsonl } = require('./runtime-utils');

async function addContact(input) {
  if (!input || !input.name) throw new TypeError('contact name is required');
  const contact = { id: input.id || crypto.randomUUID(), ...input, created_at: input.created_at || new Date().toISOString() };
  await appendJsonl('memory/crm.jsonl', { type: 'contact', ...contact });
  return contact;
}

async function listContacts() { return (await readJsonl('memory/crm.jsonl')).filter((entry) => entry.type === 'contact'); }

module.exports = { addContact, listContacts };