import { useFlowStore } from '../store/flowStore';

export default function ExecutionPath() {
  const { previewPath, nodes } = useFlowStore();

  return (
    <div className="bg-white rounded-3xl p-6 shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">Execution Path</h3>
        <span className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">LIVE</span>
      </div>

      <div className="space-y-6 pl-2">
        {previewPath.map((id, index) => {
          const node = nodes.find(n => n.id === id);
          return (
            <div key={index} className="flex gap-4">
              <div className="w-6 h-6 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {index + 1}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{node?.text}</p>
                <p className="text-xs text-slate-400 uppercase mt-0.5">{node?.type}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}