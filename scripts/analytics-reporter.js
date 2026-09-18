const { readJsonl } = require('./runtime-utils');

async function report(entries = null) {
  const events = entries || await readJsonl('memory/crm.jsonl');
  return events.reduce((summary, event) => { summary.total += 1; summary.by_type[event.type || 'unknown'] = (summary.by_type[event.type || 'unknown'] || 0) + 1; return summary; }, { total: 0, by_type: {} });
}

module.exports = { report };