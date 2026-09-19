# Hugo Core

Hugo Core is the local runtime layer for a private personal AI hub. It runs on your PC or in a Codespace, keeps memory and configuration in this repository, and exposes the local gateway through ngrok when remote access is needed.

There is no Hugging Face or Fly.io deployment flow in the intended setup. GitHub stores the source; your machine runs Hugo.

## Requirements

- Node.js 20+
- ngrok CLI for remote access
- optional: llama.cpp and a local GGUF model

## Start locally

```bash
export HUGO_DEVICE_TOKEN="$(openssl rand -hex 32)"
npm run doctor
npm start
```

PowerShell:

```powershell
$env:HUGO_DEVICE_TOKEN = [guid]::NewGuid().ToString('N')
npm run doctor
npm start
```

The gateway listens on `127.0.0.1:8787` by default. It starts only when `HUGO_DEVICE_TOKEN` is set.

## Use ngrok

Configure the token once using the ngrok CLI. Do not commit it or put it in README files:

```bash
ngrok config add-authtoken YOUR_NGROK_TOKEN
```

Then, in a second terminal:

```bash
npm run tunnel
```

The command prints the public HTTPS URL. Test it with:

```bash
curl https://YOUR-NGROK-URL.ngrok-free.app/health
curl -H "Authorization: Bearer YOUR_HUGO_DEVICE_TOKEN" \
  -H "Content-Type: application/json" \
  -X POST https://YOUR-NGROK-URL.ngrok-free.app/command \
  -d '{"action":"health"}'
```

The `/health` endpoint is intentionally public for tunnel checks. `/command` requires the Hugo bearer token. Do not expose the gateway directly with `HUGO_DEVICE_HOST=0.0.0.0` unless you understand the security consequences.

For a reserved ngrok domain:

```bash
export NGROK_DOMAIN="your-domain.ngrok.app"
npm run tunnel
```

## Checks and optional AI

```bash
npm run first-run
npm run integrations:health
npm run ai:setup
```

For llama.cpp, start `llama-server` on port `8080`, then configure:

```bash
export HUGO_LOCAL_AI_ENDPOINT=http://127.0.0.1:8080/v1/chat/completions
export HUGO_LOCAL_AI_MODEL=Qwen3-8B-Q4_K_M.gguf
npm start
```

## Security

Never commit `HUGO_DEVICE_TOKEN`, API keys, customer data, or model files. Keep ngrok authentication in the ngrok local config. Treat the generated public URL as sensitive and rotate the Hugo bearer token if it is exposed.

## Repository

https://github.com/klikmarkettt-dotcom/hugo-core
