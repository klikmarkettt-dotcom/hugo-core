# Hugo Core

## Hugo App

Open the remote interface at [hugo-app](https://klikmarkettt-dotcom.github.io/hugo-app/).
The PC remains the primary Hugo hub; the phone can connect to it through a private
Tailscale or equivalent tunnel using `scripts/device-client.js`.

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

Additional optional upstreams are recorded in `data/upstream-repositories.json`:
Playwright, the MCP TypeScript SDK and server catalog, LangGraph, and
OpenTelemetry. `scripts/playwright-adapter.js` activates only when the optional
`playwright` package is installed; the default HTTP browser path remains intact.

## PC and phone

Run the gateway on the PC with `HUGO_DEVICE_TOKEN=<random-secret> node
scripts/device-gateway.js`. Keep its default bind address on `127.0.0.1` and
expose it only through a private tunnel. Pair the phone with a generated token
from `scripts/device-pairing.js`; never put the token in GitHub or the frontend.
The gateway supports health, planning, remember, recall, browser-read, and an
explicitly configured `HUGO_PC_CONTROL_ENDPOINT` for OS-level control. Without
that endpoint, arbitrary PC control is rejected.

Memory sync covers facts, conversations, learned skills, graph indexes, and
personal state files through `syncAllMemory`; GitHub is the shared durable store.
