import { useRef, useCallback, useEffect } from 'react'
import TreeNode from './TreeNode'

function buildVisibleList(nodes, expandedIds, searchTerm, depth = 0) {
  const list = []
  for (const node of nodes) {
    const isVisible = !searchTerm || hasMatch(node, searchTerm)
    if (!isVisible) continue
    list.push({ ...node, depth })
    const isOpen = searchTerm ? hasMatch(node, searchTerm) : expandedIds.has(node.id)
    if (node.type === 'folder' && isOpen && node.children) {
      list.push(...buildVisibleList(node.children, expandedIds, searchTerm, depth + 1))
    }
  }
  return list
}

function hasMatch(node, term) {
  if (node.name.toLowerCase().includes(term.toLowerCase())) return true
  return node.children?.some((c) => hasMatch(c, term)) ?? false
}

export default function TreePanel({ data, selectedId, focusedId, onFocus, onSelect, onToggle, expandedIds, searchTerm, starredFiles, onShowStarred, onShowAuditLog }) {
  const panelRef = useRef(null)
  const visibleList = buildVisibleList(data, expandedIds, searchTerm)

  const handleKeyDown = useCallback((e) => {
    const idx = visibleList.findIndex((n) => n.id === focusedId)
    const current = visibleList[idx]
    if (e.key === 'ArrowDown') { e.preventDefault(); const next = visibleList[idx + 1]; if (next) onFocus(next.id) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); const prev = visibleList[idx - 1]; if (prev) onFocus(prev.id) }
    else if (e.key === 'ArrowRight') { e.preventDefault(); if (current?.type === 'folder' && !expandedIds.has(current.id)) onToggle(current.id) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); if (current?.type === 'folder' && expandedIds.has(current.id)) onToggle(current.id) }
    else if (e.key === 'Enter') { e.preventDefault(); if (current) { if (current.type === 'folder') onToggle(current.id); else onSelect(current) } }
  }, [visibleList, focusedId, expandedIds, onFocus, onToggle, onSelect])

  useEffect(() => {
    if (!focusedId || !panelRef.current) return
    const el = panelRef.current.querySelector(`[data-nodeid="${focusedId}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [focusedId])

  return (
    <div
      className="w-56 shrink-0 bg-vault-surface border-r border-vault-border flex flex-col overflow-hidden focus:outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={panelRef}
      aria-label="File explorer tree"
    >
      <div className="px-3 py-2 border-b border-vault-border flex items-center justify-between shrink-0">
        <span className="text-vault-muted text-xs font-semibold uppercase tracking-widest">Explorer</span>
        <span className="text-vault-muted/50 text-xs font-mono">↑↓ ←→ ↵</span>
      </div>

      {/* Quick nav */}
      <div className="px-2 py-2 border-b border-vault-border space-y-0.5 shrink-0">
        <button
          onClick={onShowStarred}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-vault-muted text-xs hover:bg-vault-bg hover:text-yellow-400 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Starred
          {starredFiles?.length > 0 && (
            <span className="ml-auto bg-yellow-400/20 text-yellow-400 text-xs px-1.5 rounded-full">{starredFiles.length}</span>
          )}
        </button>
        <button
          onClick={onShowAuditLog}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-vault-muted text-xs hover:bg-vault-bg hover:text-vault-text transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-vault-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Audit Log
        </button>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {data.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            selectedId={selectedId}
            focusedId={focusedId}
            onSelect={onSelect}
            onToggle={onToggle}
            expandedIds={expandedIds}
            searchTerm={searchTerm}
          />
        ))}
      </div>
    </div>
  )
}
