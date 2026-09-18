# Hugo Core

Backend/data layer for the Hugo/JARVIS assistant. Runtime modules use Node.js 20
and persist durable state as append-only JSONL.

## Structure

- `data/` contains schemas, catalogues, and module configuration.
- `prompts/` contains Macedonian system prompts.
- `memory/` contains facts, history, indexes, and CRM events.
- `scripts/` contains cognition, memory, vision, business, and GitHub automation.
- `data/integration-adapters.json` maps the free upstream projects to optional
	HTTP, MCP, local, and OpenAI-compatible adapters. Third-party applications are
	not vendored into this repository.

## Runtime

No package install is required. Browser screenshots and social publishing require
an explicitly configured backend endpoint and token. Public read-only browsing uses
the built-in Node.js `fetch` implementation.

Facts are appended with `scripts/memory-learn.js` and searched with
`scripts/memory-recall.js`. Never commit access tokens or private customer data.

Before release, validate JSON with `jq empty` and JavaScript with `node --check`.

## External integrations

Browser Use and Glazyr Viz can provide browser/screen control, Cognee and Memex
can provide graph or temporal memory, Open Jarvis can provide local inference,
and the social/CRM agents can provide business workflows. Configure only the
endpoint environment variable for a service you have actually deployed; run
`scripts/integration-health.js` from a small Node wrapper to inspect reachability.
The registry records capability and provenance, while the core remains usable
without any external service.
