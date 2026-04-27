import { useState } from 'react'

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const ACTION_STYLES = {
  opened: { color: 'text-vault-accent', bg: 'bg-vault-accent/10', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
  uploaded: { color: 'text-green-400', bg: 'bg-green-400/10', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
  created: { color: 'text-vault-purple', bg: 'bg-vault-purple/10', icon: 'M12 4v16m8-8H4' },
  restored: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  starred: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  tagged: { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
  downloaded: { color: 'text-cyan-400', bg: 'bg-cyan-400/10', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-5l-3 3m0 0l-3-3m3 3V4' },
  deleted: { color: 'text-red-400', bg: 'bg-red-400/10', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
}

const FILTERS = ['all', 'opened', 'uploaded', 'created', 'restored', 'starred', 'tagged', 'downloaded', 'deleted']

export default function AuditLog({ logs, onClose }) {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? logs : logs.filter((log) => log.action === filter)

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-vault-surface border border-vault-border rounded-xl w-[560px] max-h-[80vh] flex flex-col shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-vault-border shrink-0">
          <div>
            <h3 className="text-vault-text font-semibold text-sm">Activity and Audit Log</h3>
            <p className="text-vault-muted text-xs mt-0.5">{logs.length} events recorded this session</p>
          </div>
          <button onClick={onClose} className="text-vault-muted hover:text-vault-text transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-1.5 px-5 py-3 border-b border-vault-border overflow-x-auto shrink-0">
          {FILTERS.map((filterValue) => (
            <button
              key={filterValue}
              onClick={() => setFilter(filterValue)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono capitalize transition-colors shrink-0 ${filter === filterValue ? 'bg-vault-accent/15 text-vault-accent border border-vault-accent/30' : 'text-vault-muted border border-vault-border hover:text-vault-text'}`}
            >
              {filterValue}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 && (
            <div className="text-center text-vault-muted text-sm py-8">No activity yet</div>
          )}
          {filtered.map((log) => {
            const style = ACTION_STYLES[log.action] ?? ACTION_STYLES.opened
            return (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-vault-bg border border-vault-border/50">
                <div className={`w-7 h-7 rounded-md ${style.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <svg className={`w-3.5 h-3.5 ${style.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={style.icon} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold capitalize ${style.color}`}>{log.action}</span>
                    <span className="text-vault-muted/50 text-xs">.</span>
                    <span className="text-vault-muted text-xs font-mono">{log.user}</span>
                  </div>
                  <p className="text-vault-text text-xs font-mono truncate mt-0.5">{log.file}</p>
                  {log.detail && <p className="text-vault-muted/70 text-xs mt-0.5">{log.detail}</p>}
                </div>
                <span className="text-vault-muted/50 text-xs font-mono shrink-0">{timeAgo(log.ts)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
