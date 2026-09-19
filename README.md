---
title: Hugo Core
sdk: docker
app_port: 7860
---

# Hugo Core

This repository deploys to a free Hugging Face Docker Space through GitHub
Actions. The GitHub repository remains the source of truth.

Македонски водич за стартување: [README.mk.md](README.mk.md)

За 24/7 cloud deployment и GitHub push -> redeploy flow, следи го делот
**Cloud 24/7 режим** во [README.mk.md](README.mk.md).

## GitHub and app connection

Primary repository: https://github.com/klikmarkettt-dotcom/hugo-core
Remote interface: [hugo-app](https://klikmarkettt-dotcom.github.io/hugo-app/)

This project is designed to work as a connected personal AI hub:

- The GitHub repository is the durable source of truth for the project, memory,
  configs, and runtime state.
- The frontend app is a lightweight remote launcher that opens the Hugo experience
  from a browser.
- The PC where this repository runs stays as the primary hub.
- The laptop, tablet, or phone connects to that PC through a private tunnel such as
  Tailscale, ngrok, or a secure reverse tunnel, not through a public open port.

When the PC hub is running and the tunnel is active, opening the app link gives you
access to the same living system from home, work, or a phone. The endpoint is
private, authenticated, and aligned with the hub architecture in this repository.

GitHub cannot execute a permanent private assistant just because a repository page
is opened. GitHub stores the code and memory and can run short-lived Actions jobs;
a live Hugo gateway needs either a PC, a self-hosted runner, or a GitHub Codespace.
Never put API keys, device tokens, or private control credentials in committed files.

## GitHub-only first run with Codespaces

For a browser-based first run, open the repository on GitHub, choose **Code ->
Codespaces -> Create codespace on main**, and wait for the workspace to finish
creating. The included `.devcontainer/devcontainer.json` installs Node.js 20,
runs `npm run doctor`, and forwards the private gateway port `8787`.

The Codespace automatically runs `npm run first-run`. This validates the core,
loads the safe local configuration, and prints the status of optional AI, voice,
browser, and device adapters without failing just because one is not installed.

Hugo has one canonical local brain: Qwen3 8B Instruct in GGUF format, served by
`llama.cpp`. Run `npm run ai:setup` once to download the model into `.hugo/models`
and keep it outside Git. The model is a large upstream artifact and must not be
committed to the repository. After installing it, start `llama-server` on port
`8080`; Hugo will use it through the configured local endpoint.

Add `HUGO_DEVICE_TOKEN` as a Codespaces secret before starting the gateway. Without
that secret the workspace still boots safely, but the gateway remains disabled. The
Codespace is an on-demand runtime, not permanent hosting: stop it when finished and
do not use it for long-running private device control unless the required secrets and
network access are configured.

## Hugo App

Open the remote interface at [hugo-app](https://klikmarkettt-dotcom.github.io/hugo-app/).
The PC remains the primary Hugo hub; the phone can connect to it through a private
Tailscale or equivalent tunnel using `scripts/device-client.js`.

Backend/data layer for the Hugo/JARVIS assistant. Runtime modules use Node.js 20
and persist durable state as append-only JSONL.

## One-click startup flow

From the PC that hosts the repo:

1. Open this repository on the machine you want to act as the hub.
2. Run `npm run doctor` to verify the system is healthy.
3. Run `npm start` to launch the hub.
4. Keep the machine online and expose the gateway only through a private tunnel.
5. Open the web app link from a laptop or phone and connect to the living hub.

The system keeps memory, reminders, habits, tasks, and Git-backed learning state in
`memory/` and `data/`, while the private gateway exposes the relevant services only
when the token and tunnel are correctly configured.

## JARVIS vision

This is not just a static catalog. The project is intended to behave as a personal
multi-agent operating layer with:

- vision and browser automation
- memory and recall
- personal tasks, habits, and reminders
- Git-backed durable memory sync
- business and automation flows
- connected device orchestration
- optional upstream integrations for free/open tools and adapters

The app is designed to behave like a private AI operating system for the user: eyes,
ears, memory, reasoning, tasks, and remote reachability, all centered on the PC hub.

## Runtime

No package install is required. Browser screenshots and social publishing require
an explicitly configured backend endpoint and token. Public read-only browsing uses
the built-in Node.js `fetch` implementation.

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

The expanded integration layer supports optional `llama.cpp` and Open WebUI for
local cognition, Home Assistant for private device control, n8n for workflows and
webhooks, Whisper.cpp for offline speech recognition, and Piper for local speech
output. `llama.cpp` is the recommended no-API-key backend: it loads a free GGUF
model locally and exposes an OpenAI-compatible endpoint that Hugo can call without
cloud credentials. Run `npm run integrations:health` to get a machine-readable
report of configured, reachable, and unavailable adapters. Uninstalled optional
services do not stop the core runtime.

### Local AI with llama.cpp

Build or download `llama-server` and a compatible GGUF model from the
[llama.cpp repository](https://github.com/ggerganov/llama.cpp). Start the local
server with its `/v1` API enabled, then set:

```bash
export HUGO_LOCAL_AI_ENDPOINT=http://127.0.0.1:8080/v1/chat/completions
export HUGO_LOCAL_AI_MODEL=your-gguf-model-name
npm run integrations:health
npm start
```

No API key is required. The model quality and speed depend on the GGUF model and
the RAM/CPU/GPU available to the machine running the server.

## PC and phone

Run the gateway on the PC with `HUGO_DEVICE_TOKEN=<random-secret> node
scripts/device-gateway.js`. Keep its default bind address on `127.0.0.1` and
expose it only through a private tunnel. Pair the phone with a generated token
from `scripts/device-pairing.js`; never put the token in GitHub or the frontend.
The gateway supports health, planning, reasoning, decision-making, remember,
recall, vision/browser reads, automation webhooks, voice command parsing,
speech-to-text, text-to-speech, and an explicitly configured
`HUGO_PC_CONTROL_ENDPOINT` for OS-level control. Without that endpoint, arbitrary
PC control is rejected. Configure `HUGO_STT_ENDPOINT` and `HUGO_TTS_ENDPOINT` for
local Whisper.cpp and Piper HTTP adapters; the gateway passes all of these through
the same bearer-token protection.

Memory sync covers facts, conversations, learned skills, graph indexes, and
personal state files through `syncAllMemory`; GitHub is the shared durable store.

## Start on the PC

From the repository root, run `npm start`. Hugo loads reminders from `memory/todos.json`
and `memory/habits.json`, starts the 15-minute memory watcher, and starts the PC
gateway only when `HUGO_DEVICE_TOKEN` is present. Use `npm run start:once` for a
safe health/sync check. Set `HUGO_MEMORY_AUTO_PUSH=false` to commit locally without
pushing. Node.js 20+ is required; no npm dependencies are required for the core.
Copy the safe defaults from `.env.example` into your shell environment; keep real
tokens outside the repository. The reminder loop checks due todos every minute
while the PC hub is running.
