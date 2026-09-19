const { spawn } = require('node:child_process');

function startTunnel() {
  const host = process.env.HUGO_DEVICE_HOST || '127.0.0.1';
  const port = Number(process.env.HUGO_DEVICE_PORT || 8787);
  const args = ['http', `${host}:${port}`, '--log=stdout'];
  if (process.env.NGROK_DOMAIN) args.push('--domain', process.env.NGROK_DOMAIN);

  console.log(`[ngrok] Starting tunnel to http://${host}:${port}`);
  const child = spawn('ngrok', args, { stdio: 'inherit' });
  child.on('error', (error) => {
    console.error(`[ngrok] Could not start ngrok: ${error.message}`);
    console.error('[ngrok] Install ngrok and run: ngrok config add-authtoken <token>');
    process.exitCode = 1;
  });
  child.on('exit', (code, signal) => {
    if (code !== 0 && code !== null) process.exitCode = code;
    if (signal) console.log(`[ngrok] stopped (${signal})`);
  });
  process.on('SIGINT', () => child.kill('SIGINT'));
}

if (require.main === module) startTunnel();
module.exports = { startTunnel };
