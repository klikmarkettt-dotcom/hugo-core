const fs = require('node:fs');

function status(name, available, detail) {
  return { name, available, detail };
}

function report(env = process.env) {
  return {
    checked_at: new Date().toISOString(),
    capabilities: [
      status('ai-planning', true, 'local deterministic planner'),
      status('ai-reasoning', Boolean(env.HUGO_LOCAL_AI_ENDPOINT), env.HUGO_LOCAL_AI_ENDPOINT ? 'local OpenAI-compatible endpoint configured' : 'set HUGO_LOCAL_AI_ENDPOINT for actual model reasoning'),
      status('memory', true, 'JSONL and Git-backed memory'),
      status('eyes-read', true, 'HTTP/browser read and HTML extraction'),
      status('eyes-screen', Boolean(env.HUGO_BROWSER_ENDPOINT), env.HUGO_BROWSER_ENDPOINT ? 'browser screenshot/click backend configured' : 'read works; set HUGO_BROWSER_ENDPOINT for screenshots and clicks'),
      status('voice-ears', Boolean(env.HUGO_STT_ENDPOINT), env.HUGO_STT_ENDPOINT ? 'speech-to-text endpoint configured' : 'set HUGO_STT_ENDPOINT for audio input'),
      status('voice-mouth', Boolean(env.HUGO_TTS_ENDPOINT), env.HUGO_TTS_ENDPOINT ? 'text-to-speech endpoint configured' : 'set HUGO_TTS_ENDPOINT for audio output'),
      status('campaigns', fs.existsSync('data/campaign-templates.json'), 'local campaign drafts and steps'),
      status('crm', true, 'local contacts and events in memory/crm.jsonl'),
      status('facebook-publish', Boolean(env.FACEBOOK_ACCESS_TOKEN && env.FACEBOOK_PUBLISH_ENDPOINT), env.FACEBOOK_PUBLISH_ENDPOINT ? 'requires token and approved endpoint' : 'drafts work locally; publishing needs Meta credentials and endpoint'),
      status('git-sync', fs.existsSync('.git'), 'Git is the persistence and publishing boundary'),
    ],
  };
}

if (require.main === module) console.log(JSON.stringify(report(), null, 2));
module.exports = { report };