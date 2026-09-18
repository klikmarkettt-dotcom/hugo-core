const timers = new Map();

function schedule(id, intervalMs, task) {
  if (!id || !Number.isInteger(intervalMs) || intervalMs < 1000 || typeof task !== 'function') throw new TypeError('id, intervalMs >= 1000, and task are required');
  cancel(id);
  const timer = setInterval(() => Promise.resolve(task()).catch(() => undefined), intervalMs);
  timers.set(id, timer);
  return id;
}

function cancel(id) { if (timers.has(id)) { clearInterval(timers.get(id)); timers.delete(id); return true; } return false; }
function cancelAll() { for (const id of timers.keys()) cancel(id); }

module.exports = { cancel, cancelAll, schedule };