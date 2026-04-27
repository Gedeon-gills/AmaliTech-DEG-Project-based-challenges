export default function NodeCard({ node, selected, onMouseDown, onUpdateNode }) {
  const getBadgeStyle = () => {
    switch (node.type) {
      case 'start': return 'bg-primary-fixed text-on-primary-fixed-variant';
      case 'end': return 'bg-error-container text-on-error-container';
      default: return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  const getCardStyle = () => {
    // Add select-none to prevent text highlighting while dragging
    let base = "absolute bg-surface-container-lowest rounded-xl p-md transition-shadow cursor-grab active:cursor-grabbing select-none ";
    if (selected) {
      base += "border-2 border-primary-container ring-4 ring-primary/10 shadow-[0_10px_20px_rgba(93,92,222,0.12)] z-20 ";
    } else {
      base += "border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] z-10 hover:shadow-lg ";
    }
    
    if (node.type === 'start') {
      base += "w-64 border-2 border-primary-container ";
    } else {
      base += "w-72 ";
    }

    if (node.type === 'end') {
      base += "opacity-80 ";
    }

    return base;
  };

  return (
    <div 
      className={getCardStyle()} 
      style={{ left: node.position.x, top: node.position.y }}
      onMouseDown={onMouseDown}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-sm">
        <span className={`px-2 py-0.5 font-label-caps text-[10px] rounded uppercase ${getBadgeStyle()}`}>
          {node.type}
        </span>
        {node.type === 'start' ? (
          <div className="flex gap-2 items-center">
            <span className="material-symbols-outlined text-slate-400 hover:text-primary text-sm transition-colors cursor-pointer" data-icon="settings">settings</span>
            <span className="material-symbols-outlined text-primary" data-icon="play_circle">play_circle</span>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <span className="material-symbols-outlined text-slate-400 hover:text-primary text-sm transition-colors cursor-pointer" data-icon="settings">settings</span>
            <span className="material-symbols-outlined text-slate-400 text-sm cursor-grab active:cursor-grabbing" data-icon="drag_indicator">drag_indicator</span>
          </div>
        )}
      </div>
      
      <h4 className="font-h2 text-body-lg text-on-surface mb-xs leading-tight">
        {node.text}
      </h4>

      {node.type === 'start' && (
        <p className="text-body-md text-secondary mb-md">Triggers the decision tree flow.</p>
      )}

      {node.options && node.options.length > 0 && (
        <div className="space-y-2 mt-md">
          {node.options.map((opt, idx) => (
            <div key={idx} className="group flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg hover:border-primary-container transition-colors cursor-pointer">
              <span className="text-body-md text-on-surface">{opt.label}</span>
              <div className="w-2.5 h-2.5 bg-slate-300 group-hover:bg-primary rounded-full translate-x-4"></div>
            </div>
          ))}
        </div>
      )}
      
      {node.options && node.options.length > 0 && (
        <div className="mt-md pt-sm border-t border-slate-100 flex items-center justify-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const newOptions = [...(node.options || []), { label: "New Option", nextId: null }];
              onUpdateNode({ ...node, options: newOptions });
            }} 
            className="text-xs font-semibold text-primary hover:underline"
          >
            Add Option
          </button>
        </div>
      )}
      
      {node.type === 'start' && (
         <div className="flex justify-end mt-2">
            <div className="w-3 h-3 bg-primary rounded-full border-2 border-white translate-x-6 translate-y-2"></div>
         </div>
      )}
    </div>
  );
}
