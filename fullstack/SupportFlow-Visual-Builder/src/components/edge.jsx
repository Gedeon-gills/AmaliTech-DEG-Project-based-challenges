import { useEffect, useState } from 'react';

export default function Edges({ nodes }) {
  const [edges, setEdges] = useState([]);

  const calculateEdges = () => {
    const newEdges = [];
    const svg = document.querySelector('svg');

    if (!svg) return;

    const svgRect = svg.getBoundingClientRect();

    const seen = new Set(); // prevents duplicates

    nodes.forEach((parent) => {
      parent.options?.forEach((option) => {
        const child = nodes.find((n) => n.id === option.nextId);
        if (!child) return;

        const key = `${parent.id}-${option.nextId}-${option.label}`;

        // 🚨 prevent duplicate edges
        if (seen.has(key)) return;
        seen.add(key);

        const parentEl = document.querySelector(
          `[data-node-id="${parent.id}"]`
        );
        const childEl = document.querySelector(
          `[data-node-id="${child.id}"]`
        );

        if (!parentEl || !childEl) return;

        const pRect = parentEl.getBoundingClientRect();
        const cRect = childEl.getBoundingClientRect();

        const startX = pRect.right - svgRect.left;
        const startY = pRect.top + pRect.height / 2 - svgRect.top;

        const endX = cRect.left - svgRect.left;
        const endY = cRect.top + cRect.height / 2 - svgRect.top;

        const midX = (startX + endX) / 2;

        const path = `M ${startX} ${startY} Q ${midX + 40} ${startY} ${midX} ${endY} L ${endX} ${endY}`;

        newEdges.push({
          id: key, // ✅ stable key (IMPORTANT FIX)
          path,
          label: option.label,
        });

        console.log('EDGE CREATED:', {
          parent: parent.id,
          child: child.id,
          key,
        });
      });
    });

    setEdges(newEdges);
  };

  useEffect(() => {
    const timer = setTimeout(calculateEdges, 100);

    window.addEventListener('resize', calculateEdges);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateEdges);
    };
  }, [nodes]);

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#64748b" />
        </marker>
      </defs>

      {edges.map((edge) => (
        <g key={edge.id}>
          <path
            d={edge.path}
            fill="none"
            stroke="#64748b"
            strokeWidth="3"
            strokeLinecap="round"
            markerEnd="url(#arrow)"
          />
        </g>
      ))}
    </svg>
  );
}