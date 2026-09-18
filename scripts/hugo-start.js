const { readJson } = require('./runtime-utils');
const { start: startGateway } = require('./device-gateway');
const { syncOnce, watch } = require('./memory-git-sync');
const { start: startReminders } = require('./reminder-loop');

async function reminders() {
  const todos = await readJson('memory/todos.json', []);
  const habits = await readJson('memory/habits.json', { habits: [] });
  const todoItems = Array.isArray(todos) ? todos.filter((item) => item && item.done !== true) : [];
  const habitItems = Array.isArray(habits.habits) ? habits.habits : [];
  return { todos: todoItems, habits: habitItems, count: todoItems.length + habitItems.length };
}

async function start(options = {}) {
  const loaded = await reminders();
  console.log(`[hugo] PC hub ready; reminders=${loaded.count}`);
  if (loaded.count) console.log(JSON.stringify(loaded));
  if (options.sync !== false) {
    if (options.once) await syncOnce({ push: options.push });
    else watch({ immediate: true });
  }
  if (!options.once) startReminders((item) => console.log(`[reminder] ${item.title || item.text || item.id || 'due item'}`));
  if (options.gateway !== false && process.env.HUGO_DEVICE_TOKEN) startGateway();
  return loaded;
}

if (require.main === module) start({ once: process.argv.includes('--once'), gateway: !process.argv.includes('--no-gateway') }).catch((error) => { console.error(`[hugo] ${error.message}`); process.exitCode = 1; });
module.exports = { reminders, start };