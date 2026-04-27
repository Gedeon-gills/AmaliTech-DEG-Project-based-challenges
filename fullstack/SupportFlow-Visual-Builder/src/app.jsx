import { useState } from 'react';
import EditorCanvas from './components/Editor/EditorCanvas';
import ChatPreview from './components/Preview/ChatPreview';

function App() {
  const [view, setView] = useState('editor'); // 'editor' | 'preview'
  const comingSoon = () => alert('This feature is coming soon!');

  return (
    <div className="bg-background text-on-surface font-body-md overflow-hidden h-screen flex flex-col light">
      {/* TopNavBar Shell */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none flex justify-between items-center w-full px-6 h-16 shrink-0 z-50">
        <div className="flex items-center gap-8">
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">SupportFlow</span>
          <nav className="hidden md:flex gap-8 h-16 items-end">
            <a onClick={comingSoon} className="font-manrope text-sm font-medium text-slate-500 dark:text-slate-400 pb-4 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors cursor-pointer" href="#">Dashboard</a>
            <a onClick={comingSoon} className="font-manrope text-sm font-medium text-slate-500 dark:text-slate-400 pb-4 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors cursor-pointer" href="#">Analytics</a>
            <a onClick={comingSoon} className="font-manrope text-sm font-medium text-slate-500 dark:text-slate-400 pb-4 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors cursor-pointer" href="#">Team</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(view === 'editor' ? 'preview' : 'editor')}
            className="font-manrope text-sm font-medium text-indigo-600 dark:text-indigo-400 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all active:opacity-80">
            {view === 'editor' ? 'Preview' : 'Editor'}
          </button>
          <div className="flex gap-2">
            <button onClick={comingSoon} className="p-2 text-slate-500 hover:text-indigo-500 transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined" data-icon="help">help</span>
            </button>
            <button onClick={comingSoon} className="p-2 text-slate-500 hover:text-indigo-500 transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined" data-icon="settings">settings</span>
            </button>
          </div>
          <div onClick={comingSoon} className="w-8 h-8 rounded-full bg-primary-fixed-dim border border-outline-variant flex items-center justify-center overflow-hidden cursor-pointer">
             {/* Avatar Placeholder */}
             <div className="w-full h-full bg-slate-300"></div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {view === 'editor' ? <EditorCanvas /> : <ChatPreview />}
      </div>
    </div>
  );
}

export default App;
