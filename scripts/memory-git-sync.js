const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { ROOT, readJson } = require('./runtime-utils');

const exec = promisify(execFile);

async function git(args) {
  return exec('git', args, { cwd: ROOT, maxBuffer: 2 * 1024 * 1024 });
}

async function syncOnce(options = {}) {
  const config = await readJson('data/device-config.json');
  const files = options.files || config.sync?.files || ['memory'];
  await git(['add', '--', ...files]);
  const { stdout: status } = await git(['status', '--porcelain', '--', ...files]);
  if (!status.trim()) return { changed: false, pushed: false, files: files.length };
  const message = options.message || `Hugo memory sync ${new Date().toISOString()}`;
  await git(['-c', 'user.name=Hugo Bot', '-c', 'user.email=hugo@users.noreply.github.com', 'commit', '-m', message]);
  if (options.push !== false && process.env.HUGO_MEMORY_AUTO_PUSH !== 'false') {
    await git(['push', 'origin', 'HEAD']);
    return { changed: true, pushed: true, files: files.length };
  }
  return { changed: true, pushed: false, files: files.length };
}

function watch(options = {}) {
  const intervalMs = options.intervalMs || Number(process.env.HUGO_MEMORY_SYNC_INTERVAL_MS || 900000);
  if (!Number.isInteger(intervalMs) || intervalMs < 1000) throw new TypeError('sync interval must be at least 1000ms');
  const run = () => syncOnce(options).catch((error) => console.error(`[memory-sync] ${error.message}`));
  if (options.immediate !== false) run();
  return setInterval(run, intervalMs);
}

if (require.main === module) syncOnce().then((result) => console.log(JSON.stringify(result))).catch((error) => { console.error(error.message); process.exitCode = 1; });
module.exports = { syncOnce, watch };