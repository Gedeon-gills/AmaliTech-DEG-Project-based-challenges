// Generates mock version history for a file
export function generateVersions(file) {
  const base = new Date(file.modified || '2024-01-01')
  return [
    { v: 3, label: 'v3 — Current', date: file.modified, note: 'Final review edits', author: 'J. Doe', size: file.size },
    { v: 2, label: 'v2 — Yesterday', date: new Date(base.getTime() - 86400000).toISOString().slice(0, 10), note: 'Added signature block', author: 'M. Smith', size: file.size },
    { v: 1, label: 'v1 — Original', date: file.created, note: 'Initial upload', author: 'J. Doe', size: file.size },
  ]
}

export default function VersionHistory({ file, onClose, onRestore }) {
  const versions = generateVersions(file)

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-vault-surface border border-vault-border rounded-xl w-[480px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-vault-border">
          <div>
            <h3 className="text-vault-text font-semibold text-sm">Version History</h3>
            <p className="text-vault-muted text-xs font-mono mt-0.5">{file.name}</p>
          </div>
          <button onClick={onClose} className="text-vault-muted hover:text-vault-text transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Timeline */}
        <div className="p-5 space-y-0">
          {versions.map((ver, i) => (
            <div key={ver.v} className="flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full border-2 shrink-0 mt-1 ${i === 0 ? 'border-vault-accent bg-vault-accent/30' : 'border-vault-border bg-vault-bg'}`} />
                {i < versions.length - 1 && <div className="w-px flex-1 bg-vault-border my-1" />}
              </div>

              {/* Content */}
              <div className={`pb-5 flex-1 ${i === versions.length - 1 ? 'pb-0' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-xs font-semibold font-mono ${i === 0 ? 'text-vault-accent' : 'text-vault-text'}`}>{ver.label}</span>
                    <p className="text-vault-muted text-xs mt-0.5">{ver.note}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-vault-muted/60 text-xs">{ver.author}</span>
                      <span className="text-vault-muted/60 text-xs font-mono">{ver.date}</span>
                      <span className="text-vault-muted/60 text-xs">{ver.size}</span>
                    </div>
                  </div>
                  {i > 0 && (
                    <button
                      onClick={() => onRestore(ver)}
                      className="shrink-0 px-2.5 py-1 rounded-md border border-vault-border text-vault-muted text-xs hover:border-vault-accent/50 hover:text-vault-accent transition-colors"
                    >
                      Restore
                    </button>
                  )}
                  {i === 0 && (
                    <span className="shrink-0 px-2.5 py-1 rounded-md bg-vault-accent/10 text-vault-accent text-xs border border-vault-accent/30">Current</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
