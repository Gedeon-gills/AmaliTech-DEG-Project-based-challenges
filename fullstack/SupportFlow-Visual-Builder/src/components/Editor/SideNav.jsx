export default function SideNav({ onAddNode }) {
  const comingSoon = () => alert('This feature is coming soon!');

  return (
    <aside className="bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full w-64 p-4 gap-2 shrink-0 z-40">
      <div className="px-2 py-4">
        <h3 className="font-manrope text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Editor Tools</h3>
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-3 px-3 py-2.5 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer transition-transform duration-200">
          <span className="material-symbols-outlined text-lg" data-icon="account_tree">account_tree</span>
          <span className="font-manrope text-xs font-semibold uppercase tracking-wider">Nodes</span>
        </div>
        <div onClick={comingSoon} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer hover:translate-x-1 transition-transform duration-200">
          <span className="material-symbols-outlined text-lg" data-icon="variable">data_object</span>
          <span className="font-manrope text-xs font-semibold uppercase tracking-wider">Variables</span>
        </div>
        <div onClick={comingSoon} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer hover:translate-x-1 transition-transform duration-200">
          <span className="material-symbols-outlined text-lg" data-icon="mediation">mediation</span>
          <span className="font-manrope text-xs font-semibold uppercase tracking-wider">Logic</span>
        </div>
        <div onClick={comingSoon} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer hover:translate-x-1 transition-transform duration-200">
          <span className="material-symbols-outlined text-lg" data-icon="bolt">bolt</span>
          <span className="font-manrope text-xs font-semibold uppercase tracking-wider">Triggers</span>
        </div>
        <div onClick={comingSoon} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer hover:translate-x-1 transition-transform duration-200">
          <span className="material-symbols-outlined text-lg" data-icon="folder_special">folder_special</span>
          <span className="font-manrope text-xs font-semibold uppercase tracking-wider">Library</span>
        </div>
      </div>
      <button onClick={onAddNode} className="mt-4 bg-primary text-white font-manrope text-xs font-bold uppercase tracking-wider py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
        Add New Node
      </button>
      <div className="mt-auto flex flex-col gap-1 border-t border-slate-200 dark:border-slate-800 pt-4">
        <div onClick={comingSoon} className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 rounded-lg cursor-pointer transition-all">
          <span className="material-symbols-outlined text-lg" data-icon="settings">settings</span>
          <span className="font-manrope text-xs font-semibold uppercase tracking-wider">Settings</span>
        </div>
        <div onClick={comingSoon} className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 rounded-lg cursor-pointer transition-all">
          <span className="material-symbols-outlined text-lg" data-icon="account_circle">account_circle</span>
          <span className="font-manrope text-xs font-semibold uppercase tracking-wider">Account</span>
        </div>
      </div>
    </aside>
  );
}
