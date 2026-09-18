// Sync memory to GitHub
async function syncMemory(token, repo, data) {
  if (!token || !repo) throw new TypeError('token and repo are required');
  const headers = {
    'Authorization': 'token ' + token,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json'
  };
  const path = 'memory/facts.jsonl';
  const url = `https://api.github.com/repos/${repo}/contents/${path}`;
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
if (typeof window !== 'undefined') window.HUGO_MEMORY_SYNC = syncMemory;
