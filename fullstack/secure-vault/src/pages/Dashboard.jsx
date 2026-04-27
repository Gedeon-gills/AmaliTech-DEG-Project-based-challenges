import { useCallback, useEffect, useRef, useState } from 'react'
import Toolbar from '../components/Toolbar/Toolbar'
import TreePanel from '../components/Tree/TreePanel'
import FileList from '../components/fileList/fileList'
import PropertiesPanel from '../components/PropertiesPanel/PropertiesPanel'
import VersionHistory from '../components/VersionHistory'
import AuditLog from '../components/AuditLog'
import FilePreview from '../components/FilePreview'
import SettingsPanel from '../components/settingsPanel'
import { ToastContainer, toast } from '../components/Toast'
function findParentFolder(nodes, fileId) {
  for (const node of nodes) {
    if (node.children) {
      if (node.children.some((child) => child.id === fileId)) return node
      const found = findParentFolder(node.children, fileId)
      if (found) return found
    }
  }

  return null
}

function addChildToFolder(nodes, folderId, child) {
  return nodes.map((node) => {
    if (node.id === folderId) return { ...node, children: [...(node.children ?? []), child] }
    if (node.children) return { ...node, children: addChildToFolder(node.children, folderId, child) }
    return node
  })
}

function removeNodes(nodes, ids) {
  return nodes
    .filter((node) => !ids.has(node.id))
    .map((node) => (node.children ? { ...node, children: removeNodes(node.children, ids) } : node))
}

function flattenAll(nodes, path = []) {
  const results = []

  for (const node of nodes) {
    const nodePath = [...path, node.name]
    results.push({ ...node, _path: nodePath })
    if (node.children) results.push(...flattenAll(node.children, nodePath))
  }

  return results
}

function getAncestorIds(nodes, targetId, path = []) {
  for (const node of nodes) {
    if (node.id === targetId) return path
    if (node.children) {
      const found = getAncestorIds(node.children, targetId, [...path, node.id])
      if (found) return found
    }
  }

  return null
}

function collectRootIds(nodes) {
  return new Set(nodes.map((node) => node.id))
}

function getMaxNumericId(nodes) {
  return flattenAll(nodes).reduce((max, node) => {
    const current = Number.parseInt(node.id, 10)
    return Number.isNaN(current) ? max : Math.max(max, current)
  }, 0)
}

function buildInitialTags(nodes) {
  return flattenAll(nodes).reduce((tags, node) => {
    if (node.type === 'file' && node.tags?.length) tags[node.id] = [...node.tags]
    return tags
  }, {})
}

function buildInitialStarredIds(nodes) {
  return flattenAll(nodes).reduce((ids, node) => {
    if (node.type === 'file' && node.starred) ids.add(node.id)
    return ids
  }, new Set())
}

let nextId = 1
let nextLogId = 1
const MAX_RECENT = 5

function makeLog(action, file, detail = '', user = 'J. Doe') {
  return { id: nextLogId++, action, file: file?.name ?? file, detail, user, ts: new Date().toISOString() }
}

export default function Dashboard() {
  const [tree, setTree] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [search, setSearch] = useState('')
  const [newFolderModal, setNewFolderModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [expandedIds, setExpandedIds] = useState(new Set())
  const [focusedId, setFocusedId] = useState(null)
  const [recentFiles, setRecentFiles] = useState([])

  const [starredIds, setStarredIds] = useState(() => new Set())
  const [fileTags, setFileTags] = useState(() => ({}))
  const [auditLogs, setAuditLogs] = useState([])
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [viewMode, setViewMode] = useState('list')

  const [versionFile, setVersionFile] = useState(null)
  const [previewFile, setPreviewFile] = useState(null)
  const [showAuditLog, setShowAuditLog] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showStarred, setShowStarred] = useState(false)

  const uploadRef = useRef(null)

  useEffect(() => {
    fetch('/data.json')
      .then((res) => res.json())
      .then((specData) => {
        setTree(specData)
        setSelectedFolder(specData[0] ?? null)
        setExpandedIds(collectRootIds(specData))
        setFocusedId(specData[0]?.id ?? null)
        setStarredIds(buildInitialStarredIds(specData))
        setFileTags(buildInitialTags(specData))
        nextId = getMaxNumericId(specData) + 1
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const log = useCallback((action, file, detail) => {
    setAuditLogs((prev) => [makeLog(action, file, detail), ...prev])
  }, [])

  const handleToggle = useCallback((id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setFocusedId(id)
  }, [])

  const syncFolder = useCallback((id, updatedTree) => {
    return flattenAll(updatedTree).find((node) => node.id === id) ?? null
  }, [])

  const addToRecent = useCallback((file) => {
    setRecentFiles((prev) => {
      const withTimestamp = { ...file, _accessedAt: new Date().toISOString() }
      return [withTimestamp, ...prev.filter((entry) => entry.id !== file.id)].slice(0, MAX_RECENT)
    })
  }, [])

  const handleSelect = useCallback((node) => {
    if (node.type === 'file') {
      setSelectedFile(node)
      setFocusedId(node.id)
      addToRecent(node)
      log('opened', node)

      const parent = findParentFolder(tree, node.id)
      if (parent) setSelectedFolder(parent)

      const ancestors = getAncestorIds(tree, node.id)
      if (ancestors?.length) {
        setExpandedIds((prev) => {
          const next = new Set(prev)
          ancestors.forEach((id) => next.add(id))
          return next
        })
      }
    } else {
      setSelectedFolder(node)
      setFocusedId(node.id)
      setSelectedFile(null)
    }

    setSelectedIds(new Set())
  }, [addToRecent, log, tree])

  const searchResults = search.trim()
    ? flattenAll(tree).filter((node) => node.type === 'file' && node.name.toLowerCase().includes(search.toLowerCase()))
    : null

  const handleNewFolder = () => {
    const name = newFolderName.trim()
    if (!name || !selectedFolder) return

    const newFolder = { id: String(nextId++), name, type: 'folder', children: [] }
    const updated = addChildToFolder(tree, selectedFolder.id, newFolder)
    setTree(updated)
    setSelectedFolder(syncFolder(selectedFolder.id, updated))
    setExpandedIds((prev) => new Set([...prev, selectedFolder.id]))
    log('created', { name }, `Inside ${selectedFolder.name}`)
    toast(`Folder "${name}" created`, 'success')
    setNewFolderName('')
    setNewFolderModal(false)
  }

  const processUpload = useCallback((files) => {
    if (!files.length || !selectedFolder) return

    const today = new Date().toISOString().slice(0, 10)
    let updated = tree

    for (const file of files) {
      const newId = String(nextId++)
      const newFile = {
        id: newId,
        name: file.name,
        type: 'file',
        size: file.size > 1_048_576 ? `${(file.size / 1_048_576).toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`,
        modified: today,
        created: today,
        lastAccessed: today,
        security: 'Encrypted',
        owner: 'J. Doe',
        reviewedBy: 'Pending Review',
        division: 'User Uploads',
        department: selectedFolder.department ?? selectedFolder.name,
        client: selectedFolder.name,
        matter: `Uploaded to ${selectedFolder.name}`,
        workspace: 'Manual Upload',
        category: 'User Upload',
        status: 'Draft',
        version: 'v1.0',
        recordId: `UPL-${newId}`,
        retention: '7 years',
        region: 'Johannesburg',
        classification: 'Client Confidential',
        description: 'User-uploaded file stored in the secure vault.',
        checksum: `SHA256-UPL-${newId}`,
        tags: ['Draft'],
        approvalChain: 'Uploader > Reviewer',
        jurisdiction: 'South Africa',
        keywords: `${selectedFolder.name}, upload, draft`,
      }
      updated = addChildToFolder(updated, selectedFolder.id, newFile)
      log('uploaded', newFile, `To ${selectedFolder.name}`)
    }

    setTree(updated)
    setSelectedFolder(syncFolder(selectedFolder.id, updated))
    setExpandedIds((prev) => new Set([...prev, selectedFolder.id]))
    toast(`${files.length} file${files.length > 1 ? 's' : ''} uploaded`, 'success')
  }, [log, selectedFolder, syncFolder, tree])

  const handleUploadInput = (event) => {
    processUpload(Array.from(event.target.files))
    event.target.value = ''
  }

  const handleDrop = useCallback((files) => {
    processUpload(files)
  }, [processUpload])

  const handleToggleStar = useCallback((id) => {
    setStarredIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        toast('Removed from starred', 'info')
      } else {
        next.add(id)
        toast('Added to starred', 'success')
      }
      return next
    })

    const file = flattenAll(tree).find((node) => node.id === id)
    log('starred', file)
  }, [log, tree])

  const handleAddTag = useCallback((fileId, tag) => {
    setFileTags((prev) => {
      if ((prev[fileId] ?? []).includes(tag)) return prev
      return { ...prev, [fileId]: [...(prev[fileId] ?? []), tag] }
    })
    const file = flattenAll(tree).find((node) => node.id === fileId)
    log('tagged', file, `Tag: ${tag}`)
    toast(`Tag "${tag}" added`, 'info')
  }, [log, tree])

  const handleRemoveTag = useCallback((fileId, tag) => {
    setFileTags((prev) => ({ ...prev, [fileId]: (prev[fileId] ?? []).filter((value) => value !== tag) }))
  }, [])

  const handleQuickTag = useCallback((file) => {
    const candidateTags = ['Urgent', 'Review', 'Confidential', 'Archived']
    const existingTags = fileTags[file.id] ?? []
    const nextTag = candidateTags.find((tag) => !existingTags.includes(tag))

    if (!nextTag) {
      toast(`${file.name} already has the standard tags`, 'info')
      return
    }

    handleAddTag(file.id, nextTag)
  }, [fileTags, handleAddTag])

  const handleToggleSelect = useCallback((id, clearAll = false) => {
    if (clearAll) {
      setSelectedIds(new Set())
      return
    }

    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleBulkDelete = useCallback(() => {
    const count = selectedIds.size
    if (!count) return

    const updated = removeNodes(tree, selectedIds)
    setTree(updated)
    if (selectedFile && selectedIds.has(selectedFile.id)) setSelectedFile(null)

    setStarredIds((prev) => {
      const next = new Set(prev)
      selectedIds.forEach((id) => next.delete(id))
      return next
    })

    setFileTags((prev) => {
      const next = { ...prev }
      selectedIds.forEach((id) => { delete next[id] })
      return next
    })

    setSelectedIds(new Set())
    log('deleted', { name: `${count} files` }, 'Bulk delete')
    toast(`${count} file${count > 1 ? 's' : ''} deleted`, 'warning')
  }, [log, selectedFile, selectedIds, tree])

  const handleBulkDownload = useCallback(() => {
    if (!selectedIds.size) return
    toast(`Downloading ${selectedIds.size} files...`, 'info')
    log('downloaded', { name: `${selectedIds.size} files` }, 'Bulk download')
    setSelectedIds(new Set())
  }, [log, selectedIds])

  const handleOpenPreview = useCallback((file) => {
    handleSelect(file)
    setPreviewFile(file)
    log('opened', file, 'Preview opened')
  }, [handleSelect, log])

  const handleOpenProperties = useCallback((file) => {
    handleSelect(file)
  }, [handleSelect])

  const handleOpenVersionHistory = useCallback((file) => {
    handleSelect(file)
    setVersionFile(file)
  }, [handleSelect])

  const handleSingleDownload = useCallback((file) => {
    handleSelect(file)
    toast(`Downloading ${file.name}`, 'info')
    log('downloaded', file, 'Single file download')
  }, [handleSelect, log])

  const handleSingleDelete = useCallback((file) => {
    const ids = new Set([file.id])
    const updated = removeNodes(tree, ids)
    setTree(updated)
    setSelectedFile((prev) => (prev?.id === file.id ? null : prev))
    setSelectedFolder((prev) => (prev ? syncFolder(prev.id, updated) ?? updated[0] ?? null : updated[0] ?? null))
    setSelectedIds(new Set())

    setStarredIds((prev) => {
      const next = new Set(prev)
      next.delete(file.id)
      return next
    })

    setFileTags((prev) => {
      const next = { ...prev }
      delete next[file.id]
      return next
    })

    log('deleted', file, 'Removed from current workspace')
    toast(`${file.name} deleted`, 'warning')
  }, [log, syncFolder, tree])

  const handleRestore = useCallback((version) => {
    toast(`Restored ${versionFile?.name} to v${version.v}`, 'success')
    log('restored', versionFile, `Restored to v${version.v}`)
    setVersionFile(null)
  }, [log, versionFile])

  const allFlat = flattenAll(tree)
  const starredFiles = allFlat.filter((node) => node.type === 'file' && starredIds.has(node.id))

  const displayFolder = showStarred
    ? { id: '__starred__', name: 'Starred', type: 'folder', children: starredFiles }
    : searchResults
      ? { id: '__search__', name: 'Search Results', type: 'folder', children: searchResults }
      : selectedFolder

  const filePath = selectedFile
    ? allFlat.find((node) => node.id === selectedFile.id)?._path?.slice(0, -1).join(' / ')
    : null

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-vault-bg">
        <span className="text-vault-accent font-mono text-sm animate-pulse">Loading vault...</span>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-vault-bg overflow-hidden">
      <Toolbar
        search={search}
        onSearch={(value) => {
          setSearch(value)
          setShowStarred(false)
        }}
        onNewFolder={() => setNewFolderModal(true)}
        onUpload={() => uploadRef.current?.click()}
        viewMode={viewMode}
        onViewMode={setViewMode}
        onAuditLog={() => setShowAuditLog(true)}
        onSettings={() => setShowSettings(true)}
      />

      <input ref={uploadRef} type="file" multiple className="hidden" onChange={handleUploadInput} />

      <div className="flex flex-1 overflow-hidden">
        <TreePanel
          data={tree}
          selectedId={selectedFile?.id}
          focusedId={focusedId}
          onFocus={setFocusedId}
          onSelect={handleSelect}
          onToggle={handleToggle}
          expandedIds={expandedIds}
          searchTerm={search}
          starredFiles={starredFiles}
          onShowStarred={() => {
            setShowStarred(true)
            setSearch('')
          }}
          onShowAuditLog={() => setShowAuditLog(true)}
        />

        <FileList
          folder={displayFolder}
          selectedId={selectedFile?.id}
          onSelect={(node) => {
            handleSelect(node)
            if (node.type === 'file') setShowStarred(false)
          }}
          searchTerm={search}
          recentFiles={recentFiles}
          viewMode={viewMode}
          onDrop={handleDrop}
          starredIds={starredIds}
          fileTags={fileTags}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onBulkDelete={handleBulkDelete}
          onBulkDownload={handleBulkDownload}
          onOpenPreview={handleOpenPreview}
          onOpenProperties={handleOpenProperties}
          onOpenVersionHistory={handleOpenVersionHistory}
          onToggleStar={handleToggleStar}
          onQuickTag={handleQuickTag}
          onSingleDownload={handleSingleDownload}
          onSingleDelete={handleSingleDelete}
        />

        <PropertiesPanel
          file={selectedFile}
          filePath={filePath}
          starredIds={starredIds}
          onToggleStar={handleToggleStar}
          fileTags={fileTags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onVersionHistory={handleOpenVersionHistory}
          onPreview={handleOpenPreview}
        />
      </div>

      <div className="h-6 bg-vault-surface border-t border-vault-border flex items-center px-4 gap-4 shrink-0">
        <span className="text-vault-muted text-xs font-mono">
          {searchResults
            ? `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${search}"`
            : showStarred
              ? `${starredFiles.length} starred file${starredFiles.length !== 1 ? 's' : ''}`
              : selectedFile
                ? `Selected: ${selectedFile.name}`
                : selectedFolder?.name ?? ''}
        </span>
        <span className="text-vault-muted text-xs font-mono ml-auto">
          SecureVault v2.0 - Enterprise Edition
        </span>
      </div>

      {newFolderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-vault-surface border border-vault-border rounded-xl p-6 w-80 shadow-2xl">
            <h3 className="text-vault-text font-semibold mb-1">New Folder</h3>
            <p className="text-vault-muted text-xs mb-4">
              Creating inside: <span className="text-vault-accent font-mono">{selectedFolder?.name}</span>
            </p>
            <input
              autoFocus
              type="text"
              value={newFolderName}
              onChange={(event) => setNewFolderName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleNewFolder()
                if (event.key === 'Escape') {
                  setNewFolderModal(false)
                  setNewFolderName('')
                }
              }}
              placeholder="Folder name"
              className="w-full px-3 py-2 rounded-lg bg-vault-bg border border-vault-border text-vault-text text-sm font-mono placeholder-vault-muted/50 focus:outline-none focus:border-vault-accent/50 mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setNewFolderModal(false)
                  setNewFolderName('')
                }}
                className="px-4 py-1.5 rounded-lg border border-vault-border text-vault-muted text-sm hover:text-vault-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleNewFolder}
                disabled={!newFolderName.trim()}
                className="px-4 py-1.5 rounded-lg bg-vault-accent text-vault-bg text-sm font-semibold hover:bg-cyan-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {versionFile && <VersionHistory file={versionFile} onClose={() => setVersionFile(null)} onRestore={handleRestore} />}
      {previewFile && <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />}
      {showAuditLog && <AuditLog logs={auditLogs} onClose={() => setShowAuditLog(false)} />}
      {showSettings && (
        <SettingsPanel
          viewMode={viewMode}
          onViewMode={(mode) => {
            setViewMode(mode)
            setShowSettings(false)
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      <ToastContainer />
    </div>
  )
}
