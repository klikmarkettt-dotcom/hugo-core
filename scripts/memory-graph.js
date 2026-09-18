const { readJson, writeJson } = require('./runtime-utils');

async function addEntity(entity) {
  if (!entity || !entity.id) throw new TypeError('entity.id is required');
  const graph = await readJson('memory/knowledge-graph.json', { version: '1.0.0', entities: {}, relationships: [] });
  graph.entities[entity.id] = { ...graph.entities[entity.id], ...entity, updated_at: new Date().toISOString() };
  await writeJson('memory/knowledge-graph.json', graph);
  return graph.entities[entity.id];
}

async function relate(from, relation, to, metadata = {}) {
  if (!from || !relation || !to) throw new TypeError('from, relation, and to are required');
  const graph = await readJson('memory/knowledge-graph.json', { version: '1.0.0', entities: {}, relationships: [] });
  const edge = { from, relation, to, ...metadata, updated_at: new Date().toISOString() };
  if (!graph.relationships.some((item) => item.from === from && item.relation === relation && item.to === to)) graph.relationships.push(edge);
  await writeJson('memory/knowledge-graph.json', graph);
  return edge;
}

async function query(entityId) { const graph = await readJson('memory/knowledge-graph.json', { entities: {}, relationships: [] }); return graph.relationships.filter((edge) => edge.from === entityId || edge.to === entityId); }

module.exports = { addEntity, query, relate };