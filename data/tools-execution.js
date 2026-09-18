// HUGO TOOLS EXECUTION LAYER
// Auto-generated

window.HUGO_TOOLS = {
  // IMAGE
  generate_image: async (q) => {
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(q)}?width=768&height=768&seed=${Math.floor(Math.random()*1e6)}&nologo=true&model=flux`;
    return `__IMAGE__${url}__PROMPT__${q}`;
  },
  qr_code: async (q) => {
    const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(q)}&size=300x300`;
    return `__IMAGE__${url}__PROMPT__QR: ${q}`;
  },
  // CRYPTO
  coin_price: async (sym) => {
    const ids = {BTC:'bitcoin',ETH:'ethereum',SOL:'solana',BNB:'binancecoin',XRP:'ripple',ADA:'cardano',DOGE:'dogecoin'};
    const id = ids[sym.toUpperCase()] || sym.toLowerCase();
    try {
      const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd,eur&include_24hr_change=true`);
      const d = await r.json();
      const k = Object.keys(d)[0];
      if (!k) return `❌ ${sym} не е најден`;
      const i = d[k];
      const ch = i.usd_24h_change >= 0 ? '🟢 +' : '🔴 ';
      return `💰 **${sym.toUpperCase()}** = **$${i.usd.toLocaleString()}** (${ch}${i.usd_24h_change?.toFixed(2)}%)\n€${i.eur.toLocaleString()}`;
    } catch(e) { return '❌ ' + e.message; }
  },
  top_coins: async () => {
    try {
      const r = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10');
      const d = await r.json();
      return '📊 **Top 10:**\n\n' + d.map((c,i) => `${i+1}. **${c.symbol.toUpperCase()}** $${c.current_price.toLocaleString()}`).join('\n');
    } catch(e) { return '❌ ' + e.message; }
  },
  fear_greed: async () => {
    try {
      const r = await fetch('https://api.alternative.me/fng/?limit=1');
      const d = await r.json();
      const i = d.data[0];
      return `😨 **Fear & Greed: ${i.value}** (${i.value_classification})`;
    } catch(e) { return '❌ ' + e.message; }
  },
  // NEWS
  hackernews: async () => {
    try {
      const r = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      const ids = (await r.json()).slice(0,10);
      const items = await Promise.all(ids.map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(x=>x.json())));
      return '📰 **HN Top 10:**\n\n' + items.map((x,i) => `${i+1}. [${x.title}](${x.url||'https://news.ycombinator.com/item?id='+x.id}) ⭐${x.score}`).join('\n\n');
    } catch(e) { return '❌ ' + e.message; }
  },
  // WEATHER
  current_weather: async (city) => {
    try {
      const r = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
      const d = await r.json();
      const c = d.current_condition[0];
      return `🌤 **${city}**\n🌡 ${c.temp_C}°C\n💧 ${c.humidity}%\n💨 ${c.windspeedKmph} km/h\n☁ ${c.weatherDesc[0].value}`;
    } catch(e) { return '❌ ' + e.message; }
  },
  // WEB
  wikipedia: async (q) => {
    try {
      const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
      if (!r.ok) return '❌ Не е најдено';
      const d = await r.json();
      return `📖 **${d.title}**\n\n${d.extract}`;
    } catch(e) { return '❌ ' + e.message; }
  },
  translate: async (q) => {
    try {
      const parts = q.split(/\s+na\s+|\s+to\s+/i);
      const text = parts[0];
      const to = parts[1] || 'en';
      const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=mk|${to}`);
      const d = await r.json();
      return `🌐 **${text}** → **${d.responseData.translatedText}**`;
    } catch(e) { return '❌ ' + e.message; }
  },
  // GITHUB
  github_prs: async (user) => {
    user = user || 'klikmarkettt-dotcom';
    try {
      const r = await fetch(`https://api.github.com/search/issues?q=author:${user}+is:pr+is:open&per_page=20`);
      const d = await r.json();
      if (!d.items?.length) return `📋 Нема отворени PRs`;
      return `📋 **Open PRs: ${d.total_count}**\n\n` + d.items.map(x => `• #${x.number} **${x.title}**\n  ${x.repository_url.split('/').slice(-2).join('/')}`).join('\n');
    } catch(e) { return '❌ ' + e.message; }
  },
  // UTILS
  password_gen: async (len) => {
    len = parseInt(len) || 24;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-_=+';
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    let pwd = '';
    for (let i = 0; i < len; i++) pwd += chars[arr[i] % chars.length];
    return `🔐 **Лозинка (${len}):**\n\n\`${pwd}\``;
  },
  uuid_gen: async () => `🆔 \`${crypto.randomUUID()}\``,
  current_time: async () => `🕐 **${new Date().toLocaleString('mk-MK', {dateStyle:'full', timeStyle:'short'})}**`,
  // FUN
  joke: async () => {
    try {
      const r = await fetch('https://v2.jokeapi.dev/joke/Any?type=single');
      const d = await r.json();
      return `😂 ${d.joke}`;
    } catch(e) { return '❌ ' + e.message; }
  },
  trivia: async () => {
    try {
      const r = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
      const d = await r.json();
      const q = d.results[0];
      return `❓ **${q.question}**\n\n${q.incorrect_answers.concat([q.correct_answer]).sort().map((a,i)=>`${i+1}. ${a}`).join('\n')}`;
    } catch(e) { return '❌ ' + e.message; }
  },
  quote_gen: async () => {
    try {
      const r = await fetch('https://api.quotable.io/random');
      const d = await r.json();
      return `💬 "${d.content}" — *${d.author}*`;
    } catch(e) { return '❌ ' + e.message; }
  },
  // STOCKS
  stock_quote: async (sym) => {
    try {
      const r = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${sym}`);
      const d = await r.json();
      const p = d.chart.result[0].meta.regularMarketPrice;
      return `📈 **${sym}** = $${p}`;
    } catch(e) { return '❌ ' + e.message; }
  },
};
console.log('HUGO_TOOLS loaded:', Object.keys(window.HUGO_TOOLS).length);
