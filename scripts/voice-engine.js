const { requestJson } = require('./runtime-utils');

async function transcribe(audio, options = {}) {
  if (!audio) throw new TypeError('audio is required');
  if (!options.endpoint) throw new Error('A speech-to-text endpoint is required');
  return requestJson(options.endpoint, { method: 'POST', headers: { authorization: options.token ? `Bearer ${options.token}` : '', 'content-type': options.contentType || 'application/octet-stream' }, body: typeof audio === 'string' ? audio : audio });
}

async function synthesize(text, options = {}) {
  if (!text || typeof text !== 'string') throw new TypeError('text is required');
  if (!options.endpoint) throw new Error('A text-to-speech endpoint is required');
  return requestJson(options.endpoint, { method: 'POST', headers: { authorization: options.token ? `Bearer ${options.token}` : '', 'content-type': 'application/json' }, body: JSON.stringify({ text, language: options.language || 'mk-MK', voice: options.voice }) });
}

module.exports = { synthesize, transcribe };