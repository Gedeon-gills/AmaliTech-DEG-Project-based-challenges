import { useRef, useEffect } from 'react';
import { useFlowStore } from '../store/flowStore';

export default function Node({ node }) {
  const nodeRef = useRef(null);
  const { selectedId, setSelected, updateNodePosition, updateNodeText } = useFlowStore();
  const isSelected = selectedId === node.id;

  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0 });

  const onMouseDown = (e) => {
    if (e.target.closest('button, input, textarea')) return;
    dragRef.current = { isDragging: true, startX: e.clientX, startY: e.clientY };
    setSelected(node.id);
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragRef.current.isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      updateNodePosition(node.id, node.position.x + dx, node.position.y + dy);
      dragRef.current = { ...dragRef.current, startX: e.clientX, startY: e.clientY };
    };

    const onMouseUp = () => { dragRef.current.isDragging = false; };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [node.position.x, node.position.y, updateNodePosition]);

  return (
    <div
      ref={nodeRef}
      data-node-id={node.id}
      onMouseDown={onMouseDown}
      className={`absolute w-72 bg-white border-2 p-5 rounded-xl shadow-md transition-all cursor-move
        ${isSelected 
          ? 'border-primary shadow-[0_10px_20px_rgba(68,65,196,0.15)] ring-4 ring-primary/10' 
          : 'border-slate-200 hover:shadow-lg'}`}
      style={{ left: node.position.x, top: node.position.y }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded 
          ${node.type === 'start' || node.type === 'trigger' ? 'bg-primary text-white' : 
            node.type === 'end' ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-container-high text-on-surface-variant'}`}>
          {node.type.toUpperCase()}
        </span>
        {isSelected && <span className="material-symbols-outlined text-primary text-xl">drag_indicator</span>}
      </div>

      <p className="font-semibold text-on-surface text-[15px] leading-tight mb-4">
        {node.text}
      </p>

      {node.options && node.options.length > 0 && (
        <div className="space-y-2">
          {node.options.map((opt, i) => (
            <div key={i} className="flex items-center justify-between bg-surface-container-low border border-slate-100 rounded-lg p-3 text-sm">
              <span>{opt.label}</span>
              <div className="w-2 h-2 bg-primary rounded-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}