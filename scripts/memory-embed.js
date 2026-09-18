function tokenize(text) { return String(text).toLowerCase().normalize('NFKC').split(/[^\p{L}\p{N}]+/u).filter(Boolean); }

function vectorize(text, dimensions = 64) {
  if (!Number.isInteger(dimensions) || dimensions < 8) throw new TypeError('dimensions must be an integer >= 8');
  const vector = Array(dimensions).fill(0);
  for (const token of tokenize(text)) { let hash = 2166136261; for (const character of token) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619); vector[Math.abs(hash) % dimensions] += 1; }
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => Number((value / magnitude).toFixed(8)));
}

function similarity(left, right) { if (!Array.isArray(left) || left.length !== right.length) throw new TypeError('vectors must have equal dimensions'); return left.reduce((sum, value, index) => sum + value * right[index], 0); }

module.exports = { similarity, tokenize, vectorize };