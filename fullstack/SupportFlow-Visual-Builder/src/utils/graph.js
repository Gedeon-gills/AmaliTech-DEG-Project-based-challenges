export const findRoot = (nodes) => {
  // Find node with type "start" or the first node
  return nodes.find(n => n.type === 'start') || nodes[0];
};

export const buildGraphMap = (nodes) => {
  const map = {};
  nodes.forEach(node => {
    map[node.id] = node;
  });
  return map;
};

export const getNextNodes = (node, graphMap) => {
  if (!node.options || node.options.length === 0) return [];
  
  return node.options
    .map(opt => graphMap[opt.nextId])
    .filter(Boolean);
};

export const isLeafNode = (node) => {
  return !node.options || node.options.length === 0 || node.type === 'end';
};

// Simple validation: detect orphan nodes or broken links
export const validateFlow = (nodes) => {
  const graphMap = buildGraphMap(nodes);
  const issues = [];

  nodes.forEach(node => {
    if (node.options) {
      node.options.forEach(opt => {
        if (!graphMap[opt.nextId]) {
          issues.push(`Broken link from node ${node.id} to ${opt.nextId}`);
        }
      });
    }
  });

  return { valid: issues.length === 0, issues };
};