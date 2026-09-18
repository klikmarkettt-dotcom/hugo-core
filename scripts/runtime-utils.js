const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

async function readJson(relativePath, fallback = {}) {
  try {
    return JSON.parse(await fs.readFile(path.join(ROOT, relativePath), 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}

async function writeJson(relativePath, value) {
  const target = path.join(ROOT, relativePath);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function readJsonl(relativePath) {
  try {
    const content = await fs.readFile(path.join(ROOT, relativePath), 'utf8');
    return content.split('\n').filter(Boolean).map((line) => JSON.parse(line));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function appendJsonl(relativePath, value) {
  const target = path.join(ROOT, relativePath);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.appendFile(target, `${JSON.stringify(value)}\n`, 'utf8');
  return value;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { accept: 'application/json', ...(options.headers || {}) },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${url}`);
  return response.json();
}

module.exports = { ROOT, appendJsonl, readJson, readJsonl, requestJson, writeJson };