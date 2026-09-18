// Sync memory to GitHub
async function syncMemory(token, repo, data, targetPath = 'memory/facts.jsonl') {
  if (!token || !repo) throw new TypeError('token and repo are required');
  const headers = {
    'Authorization': 'token ' + token,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json'
  };
  const url = `https://api.github.com/repos/${repo}/contents/${targetPath}`;
  let sha = null;
  try {
    const r = await fetch(url, { headers });
    if (r.ok) { sha = (await r.json()).sha; }
  } catch(e) {}
  const body = {
    message: 'Sync memory ' + new Date().toISOString(),
    content: Buffer.from(String(data), 'utf8').toString('base64'),
    branch: 'main'
  };
  if (sha) body.sha = sha;
  try {
    const res = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  } catch (error) {
    throw new Error(`GitHub memory sync failed: ${error.message}`);
  }
}

async function syncAllMemory(token, repo, files, readFile) {
  if (!Array.isArray(files) || typeof readFile !== 'function') throw new TypeError('files and readFile are required');
  for (const file of files) await syncMemory(token, repo, await readFile(file), file);
  return files.length;
}
if (typeof window !== 'undefined') window.HUGO_MEMORY_SYNC = syncMemory;
if (typeof module !== 'undefined') module.exports = { syncAllMemory, syncMemory };
