const SHORTCUTS = [
  { keys: ['↑', '↓'], desc: 'Navigate tree items' },
  { keys: ['→'], desc: 'Expand folder' },
  { keys: ['←'], desc: 'Collapse folder' },
  { keys: ['Enter'], desc: 'Select file / toggle folder' },
  { keys: ['Ctrl', 'Click'], desc: 'Multi-select files' },
  { keys: ['Del'], desc: 'Delete selected files' },
  { keys: ['Ctrl', 'F'], desc: 'Focus search' },
]

export default function SettingsPanel({ viewMode, onViewMode, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-vault-surface border border-vault-border rounded-xl w-[440px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-vault-border">
          <h3 className="text-vault-text font-semibold text-sm">Settings</h3>
          <button onClick={onClose} className="text-vault-muted hover:text-vault-text transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* View mode */}
          <div>
            <p className="text-vault-muted text-xs font-semibold uppercase tracking-widest mb-3">File View Mode</p>
            <div className="flex gap-2">
              {[
                { id: 'list', label: 'List', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
                { id: 'grid', label: 'Grid', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => onViewMode(m.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold transition-colors
                    ${viewMode === m.id ? 'border-vault-accent/50 bg-vault-accent/10 text-vault-accent' : 'border-vault-border text-vault-muted hover:text-vault-text'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={m.icon} />
                  </svg>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <p className="text-vault-muted text-xs font-semibold uppercase tracking-widest mb-3">Theme</p>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-vault-bg border border-vault-border">
              <div className="w-5 h-5 rounded-full bg-vault-bg border-2 border-vault-accent" />
              <span className="text-vault-text text-xs">Dark Mode (Cyber)</span>
              <span className="ml-auto text-vault-accent text-xs">Active</span>
            </div>
          </div>

          {/* Keyboard shortcuts */}
          <div>
            <p className="text-vault-muted text-xs font-semibold uppercase tracking-widest mb-3">Keyboard Shortcuts</p>
            <div className="space-y-2">
              {SHORTCUTS.map((s) => (
                <div key={s.desc} className="flex items-center justify-between">
                  <span className="text-vault-muted text-xs">{s.desc}</span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((k) => (
                      <kbd key={k} className="px-1.5 py-0.5 rounded bg-vault-bg border border-vault-border text-vault-text text-xs font-mono">{k}</kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
