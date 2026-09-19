const { start } = require('./hugo-start');
const { check } = require('./integration-health');

async function main() {
  console.log('[hugo] first-run setup started');
  await start({ once: true, gateway: false, sync: false });
  const integrations = await check();
  const model = require('./runtime-utils').readJson('data/local-ai-model.json');
  const counts = integrations.reduce((summary, item) => {
    summary[item.status] = (summary[item.status] || 0) + 1;
    return summary;
  }, {});
  console.log(`[hugo] integration status: ${JSON.stringify(counts)}`);
  console.log(`[hugo] canonical local brain: ${(await model).id} via llama.cpp`);
  console.log('[hugo] core is ready; optional AI, voice, browser, and device services can be enabled with local endpoints');
}

if (require.main === module) main().catch((error) => {
  console.error(`[hugo] first-run failed: ${error.message}`);
  process.exitCode = 1;
});

module.exports = { main };
