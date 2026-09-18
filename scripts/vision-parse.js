function parseScreenshot(input) {
  if (!input || typeof input !== 'object') throw new TypeError('screenshot payload is required');
  return { width: input.width || null, height: input.height || null, text: input.text || '', elements: Array.isArray(input.elements) ? input.elements : [], captured_at: input.captured_at || new Date().toISOString() };
}

module.exports = { parseScreenshot };