const { create } = require('./higgsfield-client');

async function image(prompt, options = {}) { return create('image', { prompt, ...options.input }, options); }
async function video(prompt, options = {}) { return create('video', { prompt, ...options.input }, options); }
async function campaign(brief, options = {}) { return create('campaign', { brief, ...options.input }, options); }

module.exports = { campaign, image, video };