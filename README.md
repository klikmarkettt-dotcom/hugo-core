# Hugo Core

Backend/data layer for the Hugo/JARVIS assistant. Runtime modules use Node.js 20
and persist durable state as append-only JSONL.

## Structure

- `data/` contains schemas, catalogues, and module configuration.
- `prompts/` contains Macedonian system prompts.
- `memory/` contains facts, history, indexes, and CRM events.
- `scripts/` contains cognition, memory, vision, business, and GitHub automation.

## Runtime

No package install is required. Browser screenshots and social publishing require
an explicitly configured backend endpoint and token. Public read-only browsing uses
the built-in Node.js `fetch` implementation.

Facts are appended with `scripts/memory-learn.js` and searched with
`scripts/memory-recall.js`. Never commit access tokens or private customer data.

Before release, validate JSON with `jq empty` and JavaScript with `node --check`.
