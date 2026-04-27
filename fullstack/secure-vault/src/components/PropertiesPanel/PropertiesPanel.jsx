const EXT_COLORS = {
  pdf: 'text-red-400',
  docx: 'text-blue-400',
  xlsx: 'text-green-400',
  csv: 'text-emerald-400',
  msg: 'text-cyan-400',
  pptx: 'text-orange-400',
  png: 'text-yellow-400',
  zip: 'text-orange-400',
  txt: 'text-slate-400',
}

const SECURITY_STYLES = {
  Encrypted: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', dot: 'bg-green-400' },
  Shared: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
  Public: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', dot: 'bg-red-400' },
}

const PRESET_TAGS = ['Urgent', 'Confidential', 'Review', 'Archived', 'Draft', 'Priority']

export default function PropertiesPanel({
  file,
  filePath,
  starredIds,
  onToggleStar,
  fileTags,
  onAddTag,
  onRemoveTag,
  onVersionHistory,
  onPreview,
}) {
  if (!file) {
    return (
      <div className="w-60 shrink-0 bg-vault-surface border-l border-vault-border flex items-center justify-center">
        <div className="text-center px-4">
          <svg className="w-10 h-10 text-vault-border mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-vault-muted text-xs">Select a file to view properties</p>
        </div>
      </div>
    )
  }

  const ext = file.name.split('.').pop()?.toLowerCase()
  const extUpper = ext?.toUpperCase()
  const iconColor = EXT_COLORS[ext] || 'text-vault-muted'
  const secStyle = SECURITY_STYLES[file.security] ?? SECURITY_STYLES.Encrypted
  const isStarred = starredIds?.has(file.id)
  const tags = fileTags?.[file.id] ?? file.tags ?? []

  const aiSuggestions = [
    `Related workspace: ${file.workspace ?? 'Matter Intake'}`,
    `Security posture: ${file.security ?? 'Encrypted'}`,
    `Next reviewer: ${file.reviewedBy ?? 'Assigned reviewer'}`,
  ]

  const rows = [
    { label: 'Type', value: extUpper },
    { label: 'Size', value: file.size },
    { label: 'Location', value: filePath ?? '-' },
    { label: 'Created', value: file.created },
    { label: 'Modified', value: file.modified },
    { label: 'Owner', value: file.owner },
    { label: 'Department', value: file.department },
    { label: 'Division', value: file.division },
    { label: 'Record ID', value: file.recordId },
    { label: 'Version', value: file.version },
    { label: 'Retention', value: file.retention },
    { label: 'Status', value: file.status },
    { label: 'Last Accessed', value: file.lastAccessed },
    { label: 'Reviewed By', value: file.reviewedBy },
    { label: 'Classification', value: file.classification },
    { label: 'Jurisdiction', value: file.jurisdiction },
  ]

  return (
    <div className="w-72 shrink-0 bg-vault-surface border-l border-vault-border flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-vault-border flex items-center justify-between">
        <span className="text-vault-muted text-xs font-semibold uppercase tracking-widest">Properties</span>
        <button onClick={() => onToggleStar?.(file.id)} title={isStarred ? 'Unstar' : 'Star'}>
          <svg className={`w-4 h-4 transition-colors ${isStarred ? 'text-yellow-400 fill-yellow-400' : 'text-vault-muted hover:text-yellow-400'}`} viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center py-4 px-3 border-b border-vault-border">
          <div className="w-14 h-14 rounded-xl bg-vault-bg border border-vault-border flex items-center justify-center mb-2">
            <svg className={`w-7 h-7 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-vault-text text-xs font-mono text-center break-all px-1">{file.name}</span>
          {isStarred && <span className="text-yellow-400 text-xs mt-1">Starred</span>}
        </div>

        <div className="grid grid-cols-2 gap-1.5 p-3 border-b border-vault-border">
          <button
            onClick={() => onPreview?.(file)}
            className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-vault-bg border border-vault-border text-vault-muted text-xs hover:border-vault-accent/40 hover:text-vault-accent transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>
          <button
            onClick={() => onVersionHistory?.(file)}
            className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-vault-bg border border-vault-border text-vault-muted text-xs hover:border-vault-purple/40 hover:text-vault-purple transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </button>
        </div>

        <div className="p-3 border-b border-vault-border">
          <div className="text-vault-muted text-xs mb-2">Description</div>
          <p className="text-vault-text text-xs leading-relaxed">{file.description ?? 'No description available.'}</p>
        </div>

        <div className="p-3 space-y-2.5 border-b border-vault-border">
          {rows.map((row) => (
            <div key={row.label}>
              <div className="text-vault-muted text-xs mb-0.5">{row.label}</div>
              <div className="text-vault-text text-xs font-mono break-all">{row.value ?? '-'}</div>
            </div>
          ))}
        </div>

        <div className="p-3 border-b border-vault-border">
          <div className="text-vault-muted text-xs mb-2">Security Status</div>
          <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${secStyle.bg} ${secStyle.border}`}>
            <span className={`w-2 h-2 rounded-full ${secStyle.dot} animate-pulse`} />
            <span className={`text-xs font-semibold ${secStyle.text}`}>{file.security ?? 'Encrypted'}</span>
            <svg className={`w-3 h-3 ml-auto ${secStyle.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <div className="p-3 border-b border-vault-border">
          <div className="text-vault-muted text-xs mb-2">Search Keywords</div>
          <div className="text-vault-text text-xs font-mono break-all">{file.keywords ?? '-'}</div>
        </div>

        <div className="p-3 border-b border-vault-border">
          <div className="text-vault-muted text-xs mb-2">Tags</div>
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-vault-purple/10 border border-vault-purple/30 text-vault-purple text-xs">
                {tag}
                <button onClick={() => onRemoveTag?.(file.id, tag)} className="hover:text-red-400 transition-colors leading-none">x</button>
              </span>
            ))}
            {tags.length === 0 && <span className="text-vault-muted/50 text-xs">No tags</span>}
          </div>
          <div className="flex flex-wrap gap-1">
            {PRESET_TAGS.filter((tag) => !tags.includes(tag)).slice(0, 4).map((tag) => (
              <button
                key={tag}
                onClick={() => onAddTag?.(file.id, tag)}
                className="px-2 py-0.5 rounded-full border border-vault-border text-vault-muted text-xs hover:border-vault-purple/40 hover:text-vault-purple transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-3 h-3 text-vault-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-vault-muted text-xs font-semibold uppercase tracking-widest">AI Suggestions</span>
          </div>
          <div className="space-y-1">
            {aiSuggestions.map((suggestion) => (
              <div key={suggestion} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-vault-bg border border-vault-border/50 text-vault-muted text-xs hover:text-vault-text hover:border-vault-purple/30 cursor-pointer transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-vault-purple/60 shrink-0" />
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
