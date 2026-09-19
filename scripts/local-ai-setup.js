const fsp = require('node:fs/promises');
const path = require('node:path');
const { ROOT, readJson } = require('./runtime-utils');

async function install() {
  const model = await readJson('data/local-ai-model.json');
  const targetDir = path.join(ROOT, process.env.HUGO_MODEL_DIR || '.hugo/models');
  const target = path.join(targetDir, model.file);
  await fsp.mkdir(targetDir, { recursive: true });
  try {
    const stats = await fsp.stat(target);
    if (stats.size > 0) {
      console.log(`[hugo] local model already installed: ${target}`);
      return target;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  console.log(`[hugo] downloading ${model.id} from ${model.repository}`);
  const response = await fetch(model.download, { redirect: 'follow' });
  if (!response.ok || !response.body) throw new Error(`model download failed with HTTP ${response.status}`);
  const temporary = `${target}.partial`;
  await fsp.rm(temporary, { force: true });
  const file = await fsp.open(temporary, 'w');
  const reader = response.body.getReader();
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      await file.write(chunk.value);
    }
  } finally {
    await file.close();
  }
  await fsp.rename(temporary, target);
  console.log(`[hugo] local model installed: ${target}`);
  return target;
}

if (require.main === module) install().catch((error) => {
  console.error(`[hugo] ai setup failed: ${error.message}`);
  process.exitCode = 1;
});

module.exports = { install };
