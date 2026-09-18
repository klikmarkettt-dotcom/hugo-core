const { readJson } = require('./runtime-utils');

async function due() {
  const todos = await readJson('memory/todos.json', []);
  const now = Date.now();
  const items = Array.isArray(todos) ? todos : [];
  return items.filter((item) => item && item.done !== true && item.due_at && Date.parse(item.due_at) <= now);
}

function start(onReminder, intervalMs = 60000) {
  if (typeof onReminder !== 'function' || !Number.isInteger(intervalMs) || intervalMs < 1000) throw new TypeError('callback and interval >= 1000ms are required');
  const tick = () => due().then((items) => { for (const item of items) onReminder(item); }).catch((error) => console.error(`[reminders] ${error.message}`));
  tick();
  return setInterval(tick, intervalMs);
}

module.exports = { due, start };