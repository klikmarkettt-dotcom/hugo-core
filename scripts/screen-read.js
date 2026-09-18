const { browse } = require('./browser-control');

function extract(html) {
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const links = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map((match) => ({ href: match[1], text: match[2].replace(/<[^>]+>/g, '').trim() }));
  return { text, links, buttons: [...html.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi)].map((match) => match[1].replace(/<[^>]+>/g, '').trim()) };
}

async function read(url, options = {}) { return extract((await browse(url, options)).html); }

module.exports = { extract, read };