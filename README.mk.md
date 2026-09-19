# Hugo Core на македонски

## Најкратко

За вистински 24/7 cloud режим користи го делот **Cloud 24/7 режим** подолу.
Codespaces е само привремен workspace; production cloud runtime е Fly.io.

## Cloud 24/7 режим

За да работи Hugo 24/7 без твојот лаптоп, проектот има production Docker image,
persistent volume и автоматски GitHub deploy на Fly.io.

Еднаш, само за initial setup:

1. Креирај Fly.io account.
2. Инсталирај `flyctl` на твојот компјутер.
3. Најави се со `fly auth login`.
4. Од project root изврши `fly launch --no-deploy` и избери име на апликацијата.
5. Креирај production secret:

```bash
fly secrets set HUGO_DEVICE_TOKEN=$(openssl rand -hex 32)
```

6. Ако користиш cloud AI provider, постави го endpoint-от како secret:

```bash
fly secrets set \
  HUGO_CLOUD_AI_ENDPOINT=https://your-provider.example/v1/chat/completions \
  HUGO_CLOUD_AI_MODEL=your-model \
  HUGO_CLOUD_AI_API_KEY=your-secret
```

7. Направи прв deploy:

```bash
fly deploy --config fly.toml
```

Потоа додади `FLY_API_TOKEN` во GitHub repository: **Settings -> Secrets and
variables -> Actions**. Од тој момент секој push на `main` автоматски прави
redeploy преку `.github/workflows/cloud-deploy.yml`.

Memory се чува на persistent Fly volume, а source code/config се земаат од
private GitHub repository. `fly.toml` користи `min_machines_running = 1` и не го
гаси Hugo кога нема сообраќај.

Важно: cloud runtime и cloud AI inference се две одделни работи. За AI без оптоварување
на лаптопот, `HUGO_CLOUD_AI_ENDPOINT` мора да биде активен hosted OpenAI-compatible
endpoint. Hugo не измислува cloud GPU сам и не ги става тајните во Git.

По deploy провери:

```bash
fly status
fly logs
curl https://YOUR_APP_NAME.fly.dev/health
```

Откако health ќе врати `{"status":"ok"}`, користи го cloud URL-от од frontend или
client со Bearer token. Не го изложувај token-от во browser code.

Hugo е приватен AI hub со memory, planning, browser, voice, automation и agents.
GitHub го чува проектот и конфигурацијата. За вистинско извршување Hugo мора да
работи во PC, GitHub Codespace или друг server.

Најлесниот начин е GitHub Codespaces:

1. Отвори го репото: https://github.com/klikmarkettt-dotcom/hugo-core
2. Притисни **Code**.
3. Избери **Codespaces**.
4. Избери **Create codespace on main**.
5. Почекај Codespace да се отвори во browser.
6. Автоматски ќе се изврши `npm run first-run`.

Ако видиш:

```text
[hugo] core is ready
```

основниот Hugo систем е успешно стартуван.

## Важно за AI моделот

Проектот користи еден главен локален AI мозок:

- Engine: `llama.cpp`
- Model: Qwen3 8B Instruct GGUF
- API key: не е потребен
- Model file: околу 5 GB

Моделот намерно не е ставен во Git бидејќи е преголем binary фајл. Во проектот
има manifest и автоматски downloader.

Во terminal во Codespace изврши:

```bash
npm run ai:setup
```

Ова го симнува моделот во `.hugo/models/`. Не го комитирај тој folder назад во
GitHub.

## Стартување на llama.cpp

Ако `llama-server` веќе постои:

```bash
./llama-server \
  -m .hugo/models/Qwen3-8B-Q4_K_M.gguf \
  --host 127.0.0.1 \
  --port 8080
```

Ако не постои, преземи го engine-от од:

https://github.com/ggerganov/llama.cpp

Потоа изгради го со CMake:

```bash
git clone https://github.com/ggerganov/llama.cpp.git /tmp/llama.cpp
cmake -S /tmp/llama.cpp -B /tmp/llama.cpp/build
cmake --build /tmp/llama.cpp/build --config Release -j2
/tmp/llama.cpp/build/bin/llama-server \
  -m .hugo/models/Qwen3-8B-Q4_K_M.gguf \
  --host 127.0.0.1 \
  --port 8080
```

Остави го llama server-от да работи во еден terminal. Во друг terminal пушти
Hugo:

```bash
export HUGO_LOCAL_AI_ENDPOINT=http://127.0.0.1:8080/v1/chat/completions
export HUGO_LOCAL_AI_MODEL=Qwen3-8B-Q4_K_M.gguf
npm start
```

## Проверка

За основна проверка:

```bash
npm run doctor
```

За проверка на сите adapters:

```bash
npm run integrations:health
```

За повторен безбеден first-run check:

```bash
npm run first-run
```

`unconfigured` значи дека опционалниот сервис не е поставен. `unreachable` значи
дека е конфигуриран endpoint, но сервисот моментално не работи. Тоа не го руши
основниот Hugo core.

## PC и телефон

За private gateway постави token надвор од Git:

```bash
export HUGO_DEVICE_TOKEN=$(openssl rand -hex 32)
npm start
```

Gateway-от слуша локално на порт `8787` и е заштитен со Bearer token. Не го
отворај на јавен интернет. За телефон или лаптоп користи Tailscale или друг
private tunnel.

Во Codespaces, стави `HUGO_DEVICE_TOKEN` како Codespaces Secret. Не го пишувај
во README, `.env.example` или GitHub repository.

## Voice

Hugo има unified voice actions за:

- speech-to-text преку Whisper.cpp
- text-to-speech преку Piper
- voice command parsing
- македонски јазик во TTS request

Voice endpoints се опционални. Кога имаш локален STT/TTS server, постави:

```bash
export HUGO_STT_ENDPOINT=http://127.0.0.1:9000/transcribe
export HUGO_TTS_ENDPOINT=http://127.0.0.1:9001/synthesize
```

Core, memory и text AI работат и без voice models.

## Што може Hugo

- да разбие задача на чекори и да направи plan
- да reasoning-ира преку локалниот Qwen модел
- да памти и пребарува facts, разговори, habits и todos
- да чита web страници и да користи browser adapters
- да повикува APIs и webhooks
- да работи со n8n, Home Assistant и други optional adapters
- да користи voice input/output кога се активни STT/TTS endpoints
- да синхронизира memory преку Git
- да поврзе phone/browser client преку private gateway

## Што не се случува само со отворање на GitHub link

Самото отворање на repository не може да стартува постојан AI server на твојот
компјутер. GitHub чува код и може да креира Codespace, но runtime мора да работи
во Codespace, PC или server. Отворањето на GitHub Pages link само отвора frontend;
не добива автоматски пристап до приватен PC без tunnel и token.

## Безбедност

- Не пуштај API keys, tokens или private customer data во Git.
- Не пуштај `.hugo/models/` во Git.
- Не користи public bind за device gateway.
- PC control работи само со explicit `HUGO_PC_CONTROL_ENDPOINT`.
- Провери ја лиценцата на AI моделот пред redistribуција.

## Repository

https://github.com/klikmarkettt-dotcom/hugo-core
