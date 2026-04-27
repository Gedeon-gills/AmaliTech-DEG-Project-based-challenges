export default function PropertiesPanel({ node, onClose, onUpdateNode }) {
  const handleTextChange = (e) => {
    onUpdateNode({ ...node, text: e.target.value });
  };

  const handleOptionChange = (idx, value) => {
    const newOptions = [...node.options];
    newOptions[idx] = { ...newOptions[idx], label: value };
    onUpdateNode({ ...node, options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [...(node.options || []), { label: "New Option", nextId: null }];
    onUpdateNode({ ...node, options: newOptions });
  };

  const handleDeleteOption = (idx) => {
    const newOptions = node.options.filter((_, i) => i !== idx);
    onUpdateNode({ ...node, options: newOptions });
  };

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shrink-0 z-40">
      <div className="p-md border-b border-slate-100">
        <div className="flex items-center justify-between mb-xs">
          <h3 className="font-h2 text-body-lg text-on-surface">Properties</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-on-surface flex items-center justify-center">
            <span className="material-symbols-outlined" data-icon="close">close</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          <span className="text-xs font-label-caps text-slate-400">NODE ID: #{node.id}</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-md space-y-lg">
        {/* Question Input */}
        <div className="space-y-sm">
          <label className="font-label-caps text-xs text-slate-500">Text Content</label>
          <textarea 
            className="w-full rounded-xl border-slate-200 focus:ring-primary focus:border-primary text-body-md min-h-[100px] resize-none p-3 border" 
            value={node.text}
            onChange={handleTextChange}
          ></textarea>
        </div>
        
        {/* Type Selector */}
        <div className="space-y-sm">
          <label className="font-label-caps text-xs text-slate-500">Response Type</label>
          <div className="relative">
            <select 
              className="w-full appearance-none rounded-xl border-slate-200 bg-slate-50 py-2 pl-3 pr-10 text-body-md focus:ring-primary focus:border-primary border"
              value={node.type}
              onChange={(e) => onUpdateNode({ ...node, type: e.target.value })}
            >
              <option value="start">START</option>
              <option value="question">QUESTION</option>
              <option value="end">END</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <span className="material-symbols-outlined" data-icon="expand_more">expand_more</span>
            </div>
          </div>
        </div>

        {/* Answer Options */}
        {node.options && (
          <div className="space-y-md">
            <div className="flex items-center justify-between">
              <label className="font-label-caps text-xs text-slate-500">Answers</label>
              <button onClick={handleAddOption} className="text-xs font-bold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
                ADD
              </button>
            </div>
            <div className="space-y-3">
              {node.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2 group">
                  <div className="flex-1 flex items-center bg-slate-50 rounded-lg border border-slate-200 px-3 py-2">
                    <input 
                      className="bg-transparent border-none focus:ring-0 w-full p-0 text-body-md" 
                      type="text" 
                      value={opt.label}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                    />
                  </div>
                  <button onClick={() => handleDeleteOption(idx)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-error transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg" data-icon="delete">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-md bg-slate-50 border-t border-slate-200">
        <button onClick={onClose} className="w-full bg-primary text-white font-manrope font-bold py-3 rounded-xl hover:shadow-lg transition-all active:scale-98">
          Save Node Changes
        </button>
      </div>
    </aside>
  );
}
