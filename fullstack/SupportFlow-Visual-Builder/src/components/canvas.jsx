import { useEffect } from 'react';
import Node from './node';
import Edge from './edge';
import PreviewChat from './previewChat';
import { useFlowStore } from '../store/flowStore';

export default function Canvas() {
  const { nodes, mode } = useFlowStore();

  if (mode === 'preview') {
    return <PreviewChat />;
  }

  return (
    <div className="relative flex-1 overflow-auto bg-slate-100 min-h-[800px]" style={{ width: '1200px' }}>
      <Edge nodes={nodes} />
      {nodes.map((node) => (
        <Node key={node.id} node={node} />
      ))}
    </div>
  );
}