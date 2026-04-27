const drawBezier = (startX, startY, endX, endY) => {
  const offset = Math.max(Math.abs(endX - startX) / 2, 50);
  return `M ${startX} ${startY} C ${startX + offset} ${startY}, ${endX - offset} ${endY}, ${endX} ${endY}`;
};

export default function SVGConnectionEngine({ nodes }) {
  
  const NODE_WIDTH = 288; 
  const TITLE_HEIGHT = 80;
  const OPTION_HEIGHT = 48;

  const getSourceAnchor = (node, optionIndex) => {
    let x = node.position.x + NODE_WIDTH;
    let y = node.position.y + TITLE_HEIGHT + (optionIndex * OPTION_HEIGHT) + (OPTION_HEIGHT / 2);
    
    if (node.type === 'start') {
      x = node.position.x + 256;
      y = node.position.y + 120;
    }
    return { x, y };
  };

  const getTargetAnchor = (node) => {
    return {
      x: node.position.x, 
      y: node.position.y + 40 
    };
  };

  const connections = [];

  nodes.forEach(sourceNode => {
    if (sourceNode.options && sourceNode.options.length > 0) {
      sourceNode.options.forEach((opt, idx) => {
        const targetNode = nodes.find(n => n.id === opt.nextId);
        if (targetNode) {
          const start = getSourceAnchor(sourceNode, idx);
          const end = getTargetAnchor(targetNode);
          connections.push({
            id: `${sourceNode.id}-${targetNode.id}-${idx}`,
            path: drawBezier(start.x, start.y, end.x, end.y)
          });
        }
      });
    }
  });

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ minWidth: '2000px', minHeight: '2000px' }}>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
        </marker>
        <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#4441c4" />
        </marker>
      </defs>
      
      {connections.map(conn => (
        <path
          key={conn.id}
          d={conn.path}
          stroke="#94A3B8"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead)"
        />
      ))}
    </svg>
  );
}
