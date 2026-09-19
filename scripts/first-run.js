const { start } = require('./hugo-start');
const { list } = require('./integration-registry');

async function main() {
  console.log('[hugo] first-run setup started');
  await start({ once: true, gateway: false, sync: false });
  const integrations = await list();
  console.log(`[hugo] Git-only integrations: ${integrations.length}`);
  console.log('[hugo] core is ready; configure only local capabilities in your shell when needed');
}

if (require.main === module) main().catch((error) => {
  console.error(`[hugo] first-run failed: ${error.message}`);
  process.exitCode = 1;
});

module.exports = { main };
