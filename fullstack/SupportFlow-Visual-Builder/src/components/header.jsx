import { useFlowStore } from '../store/flowStore';

export default function Header() {
  const { mode, setMode } = useFlowStore();

  return (
    <header className="h-14 border-b bg-white flex items-center px-6 justify-between">
      <div className="flex items-center gap-3">
        <div className="font-semibold text-xl tracking-tight">SupportFlow</div>
        <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-mono">v1.0</div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setMode('editor')}
          className={`px-5 py-1.5 text-sm font-medium rounded-xl transition-colors ${
            mode === 'editor'
              ? 'bg-blue-600 text-white shadow'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          Editor
        </button>
        <button
          onClick={() => setMode('preview')}
          className={`px-6 py-2 rounded-2xl font-medium flex items-center gap-2 transition-all ${
            mode === 'preview' 
              ? 'bg-blue-600 text-white shadow' 
              : 'bg-white border border-slate-300 hover:bg-slate-50'
          }`}
        >
          Preview Mode
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="text-slate-400">Design System Ready</div>
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          ND
        </div>
      </div>
    </header>
  );
}