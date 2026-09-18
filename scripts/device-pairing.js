const crypto = require('node:crypto');

function createPairingToken() { return crypto.randomBytes(32).toString('base64url'); }

function pairingInfo(endpoint, token) {
  if (!endpoint || !token) throw new TypeError('endpoint and token are required');
  return { endpoint, token, created_at: new Date().toISOString(), warning: 'Store this token in a password manager; do not commit it.' };
}

module.exports = { createPairingToken, pairingInfo };