import { useFlowStore } from '../store/flowStore';

export default function PropertiesPanel() {
  const { selectedId, nodes, updateNodeText } = useFlowStore();
  const node = nodes.find(n => n.id === selectedId);

  if (!node) return <div className="w-80 bg-white p-8 text-slate-400">Select a node</div>;

  return (
    <div className="w-80 bg-white border-l flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Properties</h3>
          <button className="text-slate-400">✕</button>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
          <div className="w-2 h-2 bg-primary rounded-full" />
          NODE ID: #{node.id}
        </div>
      </div>

      <div className="flex-1 p-6 space-y-8 overflow-auto">
        <div>
          <label className="text-xs font-semibold tracking-widest text-slate-500 block mb-2">QUESTION TEXT</label>
          <textarea
            value={node.text}
            onChange={(e) => updateNodeText(node.id, e.target.value)}
            className="w-full h-28 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-primary resize-y"
          />
        </div>

        <div>
          <label className="text-xs font-semibold tracking-widest text-slate-500 block mb-2">RESPONSE TYPE</label>
          <select className="w-full border border-slate-200 rounded-xl p-3 bg-white">
            <option>Multiple Choice</option>
          </select>
        </div>

        {node.options && (
          <div>
            <div className="flex justify-between mb-3">
              <label className="text-xs font-semibold tracking-widest text-slate-500">ANSWERS</label>
              <button className="text-primary text-xs font-bold flex items-center gap-1">+ ADD</button>
            </div>
            {node.options.map((opt, i) => (
              <div key={i} className="bg-surface-container-low border border-slate-200 rounded-xl p-4 mb-3 flex items-center gap-3">
                <input type="text" value={opt.label} className="flex-1 bg-transparent outline-none" readOnly />
              </div>
            ))}
          </div>
        )}

        <div className="pt-6 border-t space-y-6">
          <div className="flex justify-between items-center">
            <span className="font-medium">Allow Skip</span>
            <div className="w-11 h-6 bg-slate-200 rounded-full relative cursor-pointer">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow" />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Logic Branching</span>
            <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t bg-slate-50">
        <button className="w-full bg-primary text-white font-bold py-4 rounded-2xl">
          Save Node Changes
        </button>
      </div>
    </div>
  );
}