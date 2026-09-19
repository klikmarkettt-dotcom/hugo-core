# Hugo Core на македонски

## Најкратко

Hugo Core е локален personal AI hub. Runtime-от работи на твојот PC или Codespace, а ngrok се користи само како tunnel за оддалечен пристап. GitHub е source of truth; нема потреба од Hugging Face или Fly.io deployment.

## Локално стартување

Потребен е Node.js 20+:

```bash
export HUGO_DEVICE_TOKEN="$(openssl rand -hex 32)"
npm run doctor
npm start
```

Во Windows PowerShell:

```powershell
$env:HUGO_DEVICE_TOKEN = [guid]::NewGuid().ToString('N')
npm run doctor
npm start
```

Gateway-от слуша локално на `127.0.0.1:8787` и не се стартува без `HUGO_DEVICE_TOKEN`.

## ngrok

Инсталирај ngrok CLI и конфигурирај го token-от локално. Не го ставај token-от во GitHub, README или `.env`:

```bash
ngrok config add-authtoken TVOJ_NGROK_TOKEN
```

Во втор terminal:

```bash
npm run tunnel
```

Командата ќе го испечати јавниот HTTPS URL. Провери го gateway-от:

```bash
curl https://TVOJ-NGROK-URL.ngrok-free.app/health
curl -H "Authorization: Bearer TVOJ_HUGO_DEVICE_TOKEN" \
  -H "Content-Type: application/json" \
  -X POST https://TVOJ-NGROK-URL.ngrok-free.app/command \
  -d '{"action":"health"}'
```

`/health` е достапен за tunnel проверка. `/command` секогаш бара Hugo bearer token. Не користи `HUGO_DEVICE_HOST=0.0.0.0` без добра причина.

За reserved ngrok domain:

```bash
export NGROK_DOMAIN="tvoj-domain.ngrok.app"
npm run tunnel
```

## Проверки и локален AI

```bash
npm run first-run
npm run integrations:health
npm run ai:setup
```

За llama.cpp стартувај `llama-server` на порт `8080`, па постави:

```bash
export HUGO_LOCAL_AI_ENDPOINT=http://127.0.0.1:8080/v1/chat/completions
export HUGO_LOCAL_AI_MODEL=Qwen3-8B-Q4_K_M.gguf
npm start
```

## Безбедност

Не комитирај `HUGO_DEVICE_TOKEN`, ngrok token, API keys, customer data или model files. Ngrok token-от чувај го во локалниот ngrok config. Ако Hugo token-от протече, веднаш генерирај нов.

## Repository

https://github.com/klikmarkettt-dotcom/hugo-core
