function getFileColor(name) {
  const ext = name.split('.').pop()?.toLowerCase()
  const colors = { pdf: 'text-red-400', docx: 'text-blue-400', xlsx: 'text-green-400', png: 'text-yellow-400', zip: 'text-orange-400' }
  return colors[ext] || 'text-vault-muted'
}

function timeAgo(isoDate) {
  if (!isoDate) return ''
  const diff = Date.now() - new Date(isoDate).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function RecentFiles({ files, selectedId, onSelect }) {
  if (!files.length) return null

  return (
    <div className="border-b border-vault-border bg-vault-surface/50">
      <div className="px-4 py-1.5 flex items-center gap-2">
        <svg className="w-3 h-3 text-vault-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-vault-muted text-xs font-semibold uppercase tracking-widest">Recent</span>
      </div>
      <div className="flex items-center gap-1 px-3 pb-2 overflow-x-auto">
        {files.map((f) => (
          <button
            key={f.id + f._accessedAt}
            onClick={() => onSelect(f)}
            title={f.name}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono whitespace-nowrap transition-all shrink-0
              ${selectedId === f.id
                ? 'border-vault-accent/50 bg-vault-accent/10 text-vault-accent'
                : 'border-vault-border bg-vault-bg text-vault-muted hover:border-vault-accent/30 hover:text-vault-text'
              }`}
          >
            <svg className={`w-3 h-3 shrink-0 ${getFileColor(f.name)}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="max-w-[100px] truncate">{f.name}</span>
            <span className="text-vault-muted/60 text-xs">{timeAgo(f._accessedAt)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
