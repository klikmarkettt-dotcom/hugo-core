# Hugo Core

Локален личен AI runtime со трајна состојба во Git. Проектот работи од овој
репозиториум и користи GitHub само за чување на кодот, конфигурацијата,
меморијата и GitHub Actions автоматизациите.

## Правила на проектот

- Нема Hugging Face, GitHub Pages, cloud deployment или remote app.
- Нема вгнездени или upstream репозиториуми во проектот.
- Нема cloud AI, јавни API алатки или задолжителни надворешни сервиси.
- Локалниот core работи без npm dependencies.
- GitHub е единствениот надворешен систем: `origin` и GitHub Actions.
- Токени и приватни податоци не се ставаат во Git.

## Барања

- Node.js 20 или понов
- Git
- GitHub repository со дозвола за push, ако се користи автоматскиот memory sync

## Почетно поставување

```bash
git clone https://github.com/klikmarkettt-dotcom/hugo-core.git
cd hugo-core
cp .env.example .env
npm run doctor
```

Очекуван резултат:

```text
[hugo] PC hub ready; reminders=0
```

`.env` е локален фајл и не се commit-ира. За првично поставување на локалниот
runtime не е потребно `npm install`.

## Користење

Стартување на core со локални reminders и Git-backed memory watcher:

```bash
npm start
```

Еднократна проверка без gateway:

```bash
npm run doctor
# или
npm run start:once
```

Локален gateway се активира само кога самиот корисник ќе постави token во
својата shell сесија:

```bash
export HUGO_DEVICE_TOKEN="$(openssl rand -hex 32)"
npm start
```

Gateway-от останува локален. Не се објавува на јавна адреса и не се користи
преку remote frontend.

## Git workflow

Сите важни промени се чуваат преку обичен Git workflow:

```bash
git status
git add .
git commit -m "Update Hugo core"
git push origin main
```

GitHub Actions само проверуваат и ажурираат Git-backed memory во истиот
репозиториум. Нема втор deployment target и нема push кон друг сервис.

За локално исклучување на автоматскиот memory push:

```bash
export HUGO_MEMORY_AUTO_PUSH=false
```

## Конфигурација

Копирај ги безбедните defaults од `.env.example` во локалната околина. Главните
поставки се:

- `HUGO_MEMORY_AUTO_PUSH`: дали memory промените се commit-ираат и push-ираат.
- `HUGO_MEMORY_SYNC_INTERVAL_MS`: интервал на Git-backed memory watcher.
- `HUGO_DEVICE_TOKEN`: локална заштита на gateway-от.

Регистарот на integrations е намерно празен и означен со policy `git-only`.
Локалните JSON и JSONL фајлови во `data/` и `memory/` се source of truth.

## Што е навистина достапно

- **AI/planning:** локален planner работи веднаш; вистинско model reasoning се
	активира со `HUGO_LOCAL_AI_ENDPOINT` кон локален OpenAI-compatible model.
- **Memory:** facts, recall, conversations, CRM, campaign drafts и Git sync се
	локални и се снимаат во `memory/`.
- **Очи:** HTTP/browser read и HTML extraction работат веднаш. Screenshots,
	clicks и type бараат локален browser backend во `HUGO_BROWSER_ENDPOINT`.
- **Уши/уста:** voice actions се подготвени; STT бара `HUGO_STT_ENDPOINT`, а
	TTS бара `HUGO_TTS_ENDPOINT`.
- **Кампании:** `campaign_create`, `campaign_list` и `campaign_update` прават
	локални draft кампањи со template steps, публика и канали.
- **Facebook:** draft workflow работи локално. Реално објавување бара одобрен
	Meta endpoint и `FACEBOOK_ACCESS_TOKEN`; Hugo не измислува дека offline може
	да објави на Facebook.
- **CRM:** контакти и events се снимаат во `memory/crm.jsonl`.

Провери ја моменталната состојба со:

```bash
npm run capabilities
```

## Структура

- `data/`: конфигурации, schemas и agent каталози.
- `memory/`: facts, conversations, habits, todos и индекси.
- `prompts/`: системски prompts.
- `scripts/`: core runtime, memory, planning, automation и gateway.
- `.github/workflows/`: GitHub-only проверки и memory automation.

## Проверки пред push

```bash
npm run doctor
node --check scripts/hugo-start.js
node --check scripts/hugo-runtime.js
node -e "const fs=require('fs'); for (const f of ['data/integrations.json','data/integration-adapters.json']) JSON.parse(fs.readFileSync(f)); console.log('JSON valid')"
```

## Безбедност

Не commit-ирај `.env`, токени, model weights или приватни customer податоци.
`.hugo/`, `node_modules/` и логовите се игнорирани преку `.gitignore`.

За промена на policy-то прво провери дека не се додава нов deployment, remote
endpoint, public API или вгнезден repository. Овој проект намерно останува
Git-only.

## Стартувај сè со еден блок

Од било која папка пушти го овој единствен блок:

```bash
set -e
REPO_URL="https://github.com/klikmarkettt-dotcom/hugo-core.git"
is_hugo_repo() {
	test -d "$1/.git" && git -C "$1" remote get-url origin 2>/dev/null \
		| grep -Eq 'github\.com/klikmarkettt-dotcom/hugo-core(\.git)?$'
}
if is_hugo_repo "$PWD"; then
	ROOT="$PWD"
	git -C "$ROOT" pull --ff-only origin main
else
	ROOT="$PWD/hugo-core"
	if test "$(basename "$PWD")" = "hugo-core"; then
		ROOT="$PWD-official"
	elif test -e "$ROOT" && ! is_hugo_repo "$ROOT"; then
		ROOT="$ROOT-official"
	fi
	if is_hugo_repo "$ROOT"; then
		git -C "$ROOT" pull --ff-only origin main
	else
		git clone "$REPO_URL" "$ROOT"
	fi
fi
cd "$ROOT"
test -f .env || cat .env.example > .env
npm run capabilities
exec npm run start:all
```

Овој блок го презема или ажурира репозиториумот, креира локален `.env`, ги
проверува capability-ите и го стартува Hugo. Прекини со `Ctrl+C`.
