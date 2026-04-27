import { memo } from 'react'

const FolderIcon = ({ open }) => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {open
      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    }
  </svg>
)

const FileIcon = () => (
  <svg className="w-4 h-4 shrink-0 text-vault-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

function highlight(name, term) {
  if (!term) return name
  const idx = name.toLowerCase().indexOf(term.toLowerCase())
  if (idx === -1) return name
  return (
    <>
      {name.slice(0, idx)}
      <mark className="bg-vault-accent/30 text-vault-accent rounded">{name.slice(idx, idx + term.length)}</mark>
      {name.slice(idx + term.length)}
    </>
  )
}

function hasMatchingDescendant(node, term) {
  if (!term) return true
  if (node.name.toLowerCase().includes(term.toLowerCase())) return true
  return node.children?.some((c) => hasMatchingDescendant(c, term)) ?? false
}

function TreeNode({ node, depth = 0, selectedId, focusedId, onSelect, onToggle, expandedIds, searchTerm }) {
  const isFolder = node.type === 'folder'
  const isOpen = searchTerm ? hasMatchingDescendant(node, searchTerm) : expandedIds.has(node.id)
  const isSelected = selectedId === node.id
  const isFocused = focusedId === node.id

  if (searchTerm && !hasMatchingDescendant(node, searchTerm)) return null

  return (
    <div>
      <div
        data-nodeid={node.id}
        className={`flex items-center gap-1.5 py-1 rounded-md cursor-pointer transition-all
          ${isSelected ? 'bg-vault-accent/15 text-vault-accent' : 'text-vault-muted hover:bg-vault-surface hover:text-vault-text'}
          ${isFocused && !isSelected ? 'ring-1 ring-vault-accent/50 bg-vault-surface text-vault-text' : ''}
        `}
        style={{ paddingLeft: `${depth * 12 + 8}px`, paddingRight: '8px' }}
        onClick={() => {
          if (isFolder) onToggle(node.id)
          else onSelect(node)
        }}
      >
        {isFolder ? (
          <svg className={`w-3 h-3 shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        ) : (
          <span className="w-3 shrink-0" />
        )}
        {isFolder
          ? <span className="text-vault-accent shrink-0"><FolderIcon open={isOpen} /></span>
          : <FileIcon />
        }
        <span className="truncate text-xs font-mono">{highlight(node.name, searchTerm)}</span>
      </div>

      {isFolder && isOpen && node.children?.map((child) => (
        <TreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          selectedId={selectedId}
          focusedId={focusedId}
          onSelect={onSelect}
          onToggle={onToggle}
          expandedIds={expandedIds}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  )
}

export default memo(TreeNode)
