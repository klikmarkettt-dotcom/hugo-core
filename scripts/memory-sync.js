// Sync memory to GitHub
async function syncMemory(token, repo, data) {
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
    content: btoa(unescape(encodeURIComponent(data))),
    branch: 'main'
  };
  if (sha) body.sha = sha;
  const res = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body) });
  return res.ok;
}
if (typeof window !== 'undefined') window.HUGO_MEMORY_SYNC = syncMemory;
