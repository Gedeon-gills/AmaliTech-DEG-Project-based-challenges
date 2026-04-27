
export default function Toolbar({ search, onSearch, onNewFolder, onUpload, viewMode, onViewMode, onAuditLog, onSettings }) {
  return (
    <div className="h-14 bg-vault-surface border-b border-vault-border flex items-center px-4 gap-3 shrink-0">
      <div className="flex items-center gap-2 mr-1 shrink-0">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-vault-accent to-vault-purple flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <span className="text-vault-text font-bold text-sm hidden sm:block">SecureVault</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vault-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search files and folders..."
          className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-vault-bg border border-vault-border text-vault-text text-sm placeholder-vault-muted/50 focus:outline-none focus:border-vault-accent/50 transition-colors font-mono"
        />
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {/* View mode */}
        <div className="flex items-center border border-vault-border rounded-lg overflow-hidden">
          <button
            onClick={() => onViewMode('list')}
            className={`px-2 py-1.5 transition-colors ${viewMode === 'list' ? 'bg-vault-accent/15 text-vault-accent' : 'text-vault-muted hover:text-vault-text'}`}
            title="List view"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => onViewMode('grid')}
            className={`px-2 py-1.5 transition-colors ${viewMode === 'grid' ? 'bg-vault-accent/15 text-vault-accent' : 'text-vault-muted hover:text-vault-text'}`}
            title="Grid view"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>

        <button onClick={onNewFolder} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-vault-border text-vault-muted text-xs hover:border-vault-accent/40 hover:text-vault-text transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:block">New Folder</span>
        </button>

        <button onClick={onUpload} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-vault-accent text-vault-bg text-xs font-semibold hover:bg-cyan-300 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="hidden sm:block">Upload</span>
        </button>

        {/* Audit log */}
        <button onClick={onAuditLog} title="Audit Log" className="p-1.5 rounded-lg border border-vault-border text-vault-muted hover:text-vault-text hover:border-vault-accent/40 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </button>

        {/* Settings */}
        <button onClick={onSettings} title="Settings" className="p-1.5 rounded-lg border border-vault-border text-vault-muted hover:text-vault-text hover:border-vault-accent/40 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <div className="w-8 h-8 rounded-full bg-vault-purple/30 border border-vault-purple/50 flex items-center justify-center text-vault-purple text-xs font-bold ml-1">
          JD
        </div>
      </div>
    </div>
  )
}
