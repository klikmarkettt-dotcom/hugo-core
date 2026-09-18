# 🔒 Hugo Core (Private)

Data files for Hugo AI app. The public HTML app fetches these files via GitHub API with user token.

## Structure
- `data/` — skills, translate dict, tools, agents, cant
- `prompts/` — system prompts
- `memory/` — persisted memory (facts, learned, history)
- `tools/` — recipes, configs

## Public app
🌐 https://klikmarkettt-dotcom.github.io/hugo-app/

## How it works
1. User opens app
2. Enters GitHub token (gist + repo scope)
3. App reads all files via GitHub API
4. App writes memory.json back on changes
