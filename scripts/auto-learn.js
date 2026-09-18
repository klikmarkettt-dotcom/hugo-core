// Hugo Auto-Learn script
const fs = require('node:fs/promises');
const SOURCES = [
  'e2b-dev/awesome-ai-agents',
  'punkpeye/awesome-mcp-servers',
  'kyrolabs/awesome-langchain',
  'steven2358/awesome-generative-ai',
  'IshaanLabs/Awesome-AI-Agents',
  'humanloop/awesome-llm-apps',
];

async function learnFromRepo(repo) {
  try {
    const info = await fetch(`https://api.github.com/repos/${repo}`).then(r => r.json());
    let readme = '';
    for (const br of [info.default_branch, 'main', 'master']) {
      try {
        const r = await fetch(`https://raw.githubusercontent.com/${repo}/${br}/README.md`);
        if (r.ok) { readme = await r.text(); break; }
      } catch(e) {}
    }
    if (!readme) return [];
    const skills = [];
    const lines = readme.split('\n');
    for (const line of lines) {
      const m = line.match(/^\s*[-*]\s+\[([^\]]+)\]\(([^)]+)\)\s*[-–—:]\s*(.+)$/);
      if (m && m[1].length > 2 && m[3].length > 8) {
        skills.push({ name: m[1], url: m[2], desc: m[3], source: repo });
      }
    }
    return skills;
  } catch(e) { return []; }
}

async function autoLearn() {
  let total = 0;
  const learned = [];
  for (const repo of SOURCES) {
    const skills = await learnFromRepo(repo);
    total += skills.length;
    learned.push(...skills.map((skill) => ({ ...skill, learned_at: new Date().toISOString() })));
    console.log(`Learned ${skills.length} from ${repo}`);
  }
  if (learned.length) await fs.appendFile('memory/learned.jsonl', `${learned.map((item) => JSON.stringify(item)).join('\n')}\n`, 'utf8');
  console.log(`Total: ${total}`);
  return total;
}

if (typeof window !== 'undefined') window.HUGO_AUTO_LEARN = { learnFromRepo, autoLearn };
if (typeof module !== 'undefined') module.exports = { learnFromRepo, autoLearn };
