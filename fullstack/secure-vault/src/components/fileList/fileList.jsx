import { Fragment, useEffect, useState } from 'react'
import RecentFiles from './RecentFiles'

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

const SEC_COLORS = {
  Encrypted: 'text-green-400',
  Shared: 'text-yellow-400',
  Public: 'text-red-400',
}

const FILE_TYPES = ['All Types', 'PDF', 'DOCX', 'XLSX', 'CSV', 'MSG', 'PPTX', 'PNG', 'ZIP', 'TXT']

function getFileColor(name) {
  return EXT_COLORS[name.split('.').pop()?.toLowerCase()] || 'text-vault-muted'
}

function highlight(name, term) {
  if (!term) return name
  const idx = name.toLowerCase().indexOf(term.toLowerCase())
  if (idx === -1) return name

  return (
    <>
      {name.slice(0, idx)}
      <mark className="bg-vault-accent/30 text-vault-accent rounded px-0.5">{name.slice(idx, idx + term.length)}</mark>
      {name.slice(idx + term.length)}
    </>
  )
}

function formatPath(item, folder) {
  if (item._path?.length) return item._path.slice(0, -1).join(' / ')
  if (folder?.name) return `Vault / ${folder.name}`
  return 'Vault'
}

function buildMetadataRows(item, folder, tags) {
  return [
    { label: 'Department', value: item.department },
    { label: 'Division', value: item.division },
    { label: 'Owner', value: item.owner },
    { label: 'Matter', value: item.matter },
    { label: 'Workspace', value: item.workspace },
    { label: 'Record ID', value: item.recordId },
    { label: 'Version', value: item.version },
    { label: 'Status', value: item.status },
    { label: 'Retention', value: item.retention },
    { label: 'Region', value: item.region },
    { label: 'Classification', value: item.classification },
    { label: 'Reviewed By', value: item.reviewedBy },
    { label: 'Last Accessed', value: item.lastAccessed },
    { label: 'Jurisdiction', value: item.jurisdiction },
    { label: 'Approval Chain', value: item.approvalChain },
    { label: 'Location', value: formatPath(item, folder) },
    { label: 'Keywords', value: item.keywords },
    { label: 'Tags', value: tags.join(', ') || '-' },
    { label: 'Checksum', value: item.checksum },
  ]
}

export default function FileList({
  folder,
  selectedId,
  onSelect,
  searchTerm,
  recentFiles,
  viewMode = 'list',
  onDrop,
  starredIds,
  fileTags,
  selectedIds,
  onToggleSelect,
  onBulkDelete,
  onBulkDownload,
  onOpenPreview,
  onOpenProperties,
  onOpenVersionHistory,
  onToggleStar,
  onQuickTag,
  onSingleDownload,
  onSingleDelete,
}) {
  const [dragOver, setDragOver] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [dateFilter, setDateFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [contextMenu, setContextMenu] = useState(null)

  useEffect(() => {
    setExpandedRows(new Set())
    setContextMenu(null)
  }, [folder?.id, searchTerm, viewMode])

  useEffect(() => {
    if (!contextMenu) return undefined

    const close = () => setContextMenu(null)
    const onKeyDown = (event) => {
      if (event.key === 'Escape') close()
    }

    window.addEventListener('click', close)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('click', close)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [contextMenu])

  const handleDragOver = (event) => {
    event.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => setDragOver(false)

  const handleDrop = (event) => {
    event.preventDefault()
    setDragOver(false)
    const files = Array.from(event.dataTransfer.files)
    if (files.length) onDrop?.(files)
  }

  const toggleDetails = (item) => {
    if (item.type !== 'file') return
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(item.id)) next.delete(item.id)
      else next.add(item.id)
      return next
    })
    onSelect?.(item)
  }

  if (!folder) {
    return (
      <div className="flex-1 flex items-center justify-center text-vault-muted text-sm">
        Select a folder to view its contents
      </div>
    )
  }

  const isSearchView = folder.id === '__search__'
  const isStarredView = folder.id === '__starred__'
  let items = folder.children ?? []

  if (typeFilter !== 'All Types') {
    items = items.filter((item) => item.type === 'file' && item.name.toLowerCase().endsWith(`.${typeFilter.toLowerCase()}`))
  }
  if (dateFilter) {
    items = items.filter((item) => item.modified >= dateFilter)
  }
  if (tagFilter) {
    items = items.filter((item) => (fileTags?.[item.id] ?? item.tags ?? []).some((tag) => tag.toLowerCase().includes(tagFilter.toLowerCase())))
  }

  const files = items.filter((item) => item.type === 'file')
  const folders = items.filter((item) => item.type === 'folder')
  const displayItems = isSearchView || isStarredView ? files : [...folders, ...files]
  const multiCount = selectedIds?.size ?? 0

  const openContextMenu = (event, item) => {
    if (item.type !== 'file') return
    event.preventDefault()
    onSelect?.(item)
    const menuWidth = 224
    const menuHeight = 300
    const x = Math.min(event.clientX, window.innerWidth - menuWidth - 16)
    const y = Math.min(event.clientY, window.innerHeight - menuHeight - 16)
    setContextMenu({ item, x, y })
  }

  const contextActions = contextMenu
    ? [
        { label: 'Preview', onClick: () => onOpenPreview?.(contextMenu.item) },
        { label: 'Properties', onClick: () => onOpenProperties?.(contextMenu.item) },
        { label: 'Version History', onClick: () => onOpenVersionHistory?.(contextMenu.item) },
        { label: starredIds?.has(contextMenu.item.id) ? 'Remove Star' : 'Star File', onClick: () => onToggleStar?.(contextMenu.item.id) },
        { label: 'Add Tag', onClick: () => onQuickTag?.(contextMenu.item) },
        { label: 'Download', onClick: () => onSingleDownload?.(contextMenu.item) },
        { label: 'Delete', danger: true, onClick: () => onSingleDelete?.(contextMenu.item) },
      ]
    : []

  return (
    <div
      className={`flex-1 flex flex-col overflow-hidden relative transition-all ${dragOver ? 'ring-2 ring-inset ring-vault-accent/50' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {dragOver && (
        <div className="absolute inset-0 z-20 bg-vault-accent/5 border-2 border-dashed border-vault-accent/50 flex items-center justify-center pointer-events-none rounded-lg m-2">
          <div className="text-center">
            <svg className="w-12 h-12 text-vault-accent mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="text-vault-accent font-semibold text-sm">Drop files to upload</p>
            <p className="text-vault-muted text-xs mt-1">into {folder.name}</p>
          </div>
        </div>
      )}

      <RecentFiles files={recentFiles ?? []} selectedId={selectedId} onSelect={onSelect} />

      <div className="px-4 py-2 border-b border-vault-border flex items-center gap-2 text-xs font-mono text-vault-muted">
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {isSearchView ? (
            <>
              <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-vault-accent">Search Results</span>
              <span className="ml-1 truncate">for "{searchTerm}"</span>
            </>
          ) : isStarredView ? (
            <>
              <span className="text-yellow-400">Starred</span>
              <span className="text-vault-text ml-1">Files</span>
            </>
          ) : (
            <>
              <span className="text-vault-accent">Vault</span>
              <span>/</span>
              <span className="text-vault-text truncate">{folder.name}</span>
            </>
          )}
        </div>
        <button
          onClick={() => setShowFilters((value) => !value)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs transition-colors ${showFilters ? 'border-vault-accent/50 text-vault-accent bg-vault-accent/10' : 'border-vault-border text-vault-muted hover:text-vault-text'}`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="px-4 py-3 border-b border-vault-border bg-vault-surface/50 flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-vault-muted text-xs block mb-1">File Type</label>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="bg-vault-bg border border-vault-border text-vault-text text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-vault-accent/50"
            >
              {FILE_TYPES.map((type) => <option key={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <label className="text-vault-muted text-xs block mb-1">Modified After</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="bg-vault-bg border border-vault-border text-vault-text text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-vault-accent/50"
            />
          </div>
          <div>
            <label className="text-vault-muted text-xs block mb-1">Tag</label>
            <input
              type="text"
              value={tagFilter}
              onChange={(event) => setTagFilter(event.target.value)}
              placeholder="e.g. Urgent"
              className="bg-vault-bg border border-vault-border text-vault-text text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-vault-accent/50 w-28"
            />
          </div>
          <button
            onClick={() => {
              setTypeFilter('All Types')
              setDateFilter('')
              setTagFilter('')
            }}
            className="text-vault-muted text-xs hover:text-vault-text transition-colors pb-1.5"
          >
            Clear
          </button>
        </div>
      )}

      {multiCount > 0 && (
        <div className="px-4 py-2 border-b border-vault-accent/30 bg-vault-accent/5 flex items-center gap-3">
          <span className="text-vault-accent text-xs font-semibold">{multiCount} selected</span>
          <button onClick={onBulkDownload} className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-vault-border text-vault-muted text-xs hover:text-vault-text transition-colors">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
          <button onClick={onBulkDelete} className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10 transition-colors">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
          <button onClick={() => onToggleSelect?.(null, true)} className="ml-auto text-vault-muted text-xs hover:text-vault-text transition-colors">
            Clear
          </button>
        </div>
      )}

      {viewMode === 'list' && (
        <>
          <div className="grid grid-cols-12 px-4 py-2 border-b border-vault-border text-vault-muted text-xs font-semibold uppercase tracking-wider">
            <div className="col-span-1">View</div>
            <div className="col-span-4">Name</div>
            {isSearchView ? <div className="col-span-3">Path</div> : <div className="col-span-2">Type</div>}
            <div className="col-span-2">Size</div>
            <div className={isSearchView ? 'col-span-2' : 'col-span-3'}>Modified</div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {displayItems.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 gap-2 text-vault-muted text-sm">
                {isSearchView ? (
                  <>
                    <span className="text-2xl">No match</span>
                    <span>No files match "{searchTerm}"</span>
                  </>
                ) : (
                  'Empty folder'
                )}
              </div>
            )}

            {displayItems.map((item) => {
              const isMultiSelected = selectedIds?.has(item.id)
              const tags = fileTags?.[item.id] ?? item.tags ?? []
              const isExpanded = expandedRows.has(item.id)
              const metadataRows = buildMetadataRows(item, folder, tags)

              return (
                <Fragment key={item.id}>
                  <div
                    onClick={(event) => {
                      if (event.ctrlKey || event.metaKey) {
                        onToggleSelect?.(item.id)
                        return
                      }
                      onSelect?.(item)
                    }}
                    onContextMenu={(event) => openContextMenu(event, item)}
                    className={`grid grid-cols-12 px-4 py-2.5 border-b border-vault-border/50 cursor-pointer transition-all ${selectedId === item.id ? 'bg-vault-accent/10 border-l-2 border-l-vault-accent' : ''} ${isMultiSelected ? 'bg-vault-purple/10' : ''} ${!selectedId && !isMultiSelected ? 'hover:bg-vault-surface' : ''}`}
                  >
                    <div className="col-span-1 flex items-center gap-2">
                      {item.type === 'file' ? (
                        <button
                          type="button"
                          aria-label={isExpanded ? 'Collapse metadata' : 'Expand metadata'}
                          onClick={(event) => {
                            event.stopPropagation()
                            toggleDetails(item)
                          }}
                          className="w-5 h-5 rounded-md border border-vault-border flex items-center justify-center text-vault-muted hover:text-vault-accent hover:border-vault-accent/30 transition-colors"
                        >
                          <svg className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90 text-vault-accent' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ) : (
                        <span className="w-5 h-5 shrink-0" />
                      )}
                      <input
                        type="checkbox"
                        checked={!!isMultiSelected}
                        onChange={() => onToggleSelect?.(item.id)}
                        onClick={(event) => event.stopPropagation()}
                        className="w-3 h-3 accent-cyan-400"
                      />
                    </div>

                    <div className="col-span-4 flex items-center gap-2 truncate">
                      {item.type === 'folder' ? (
                        <svg className="w-4 h-4 text-vault-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      ) : (
                        <svg className={`w-4 h-4 shrink-0 ${getFileColor(item.name)}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      <div className="min-w-0">
                        <span className={`truncate font-mono text-xs block ${selectedId === item.id ? 'text-vault-accent' : 'text-vault-text'}`}>
                          {highlight(item.name, searchTerm)}
                        </span>
                        {item.type === 'file' && (
                          <span className="text-vault-muted/70 text-[11px] block truncate">
                            {item.department ?? item.workspace ?? 'Secure vault record'}
                          </span>
                        )}
                        {tags.length > 0 && (
                          <div className="flex gap-1 mt-0.5">
                            {tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="px-1 py-0 rounded text-vault-purple text-xs bg-vault-purple/10">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      {starredIds?.has(item.id) && (
                        <svg className="w-3.5 h-3.5 text-yellow-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      )}
                    </div>

                    {isSearchView ? (
                      <div className="col-span-3 text-vault-muted text-xs self-center font-mono truncate">{formatPath(item, folder)}</div>
                    ) : (
                      <div className="col-span-2 text-vault-muted text-xs self-center font-mono">{item.type === 'folder' ? 'Folder' : item.name.split('.').pop()?.toUpperCase()}</div>
                    )}

                    <div className="col-span-2 text-vault-muted text-xs self-center font-mono">{item.size ?? '-'}</div>
                    <div className={`${isSearchView ? 'col-span-2' : 'col-span-3'} flex items-center gap-2`}>
                      <span className="text-vault-muted text-xs font-mono">{item.modified ?? '-'}</span>
                      {item.security && <span className={`text-xs ${SEC_COLORS[item.security] ?? 'text-vault-muted'}`}>o</span>}
                    </div>
                  </div>

                  {item.type === 'file' && isExpanded && (
                    <div className="border-b border-vault-border/50 bg-vault-bg/40 px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <button onClick={() => onOpenPreview?.(item)} className="px-2.5 py-1 rounded-md border border-vault-border text-vault-muted text-xs hover:text-vault-accent hover:border-vault-accent/40 transition-colors">
                          Preview
                        </button>
                        <button onClick={() => onOpenProperties?.(item)} className="px-2.5 py-1 rounded-md border border-vault-border text-vault-muted text-xs hover:text-vault-text transition-colors">
                          Properties
                        </button>
                        <button onClick={() => onOpenVersionHistory?.(item)} className="px-2.5 py-1 rounded-md border border-vault-border text-vault-muted text-xs hover:text-vault-purple transition-colors">
                          Version History
                        </button>
                        <button onClick={() => onToggleStar?.(item.id)} className="px-2.5 py-1 rounded-md border border-vault-border text-vault-muted text-xs hover:text-yellow-400 transition-colors">
                          {starredIds?.has(item.id) ? 'Remove Star' : 'Star'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {metadataRows.map((row) => (
                          <div key={`${item.id}-${row.label}`} className="rounded-lg border border-vault-border/70 bg-vault-surface/50 px-3 py-2">
                            <div className="text-vault-muted text-[11px] uppercase tracking-wider mb-1">{row.label}</div>
                            <div className="text-vault-text text-xs font-mono break-all">{row.value ?? '-'}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 rounded-lg border border-vault-border/70 bg-vault-surface/50 px-3 py-3">
                        <div className="text-vault-muted text-[11px] uppercase tracking-wider mb-1">Description</div>
                        <p className="text-vault-text text-xs leading-relaxed">{item.description ?? 'No description available.'}</p>
                      </div>
                    </div>
                  )}
                </Fragment>
              )
            })}
          </div>
        </>
      )}

      {viewMode === 'grid' && (
        <div className="flex-1 overflow-y-auto p-4">
          {displayItems.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 gap-2 text-vault-muted text-sm">
              Empty folder
            </div>
          )}
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {displayItems.map((item) => {
              const isMultiSelected = selectedIds?.has(item.id)
              const tags = fileTags?.[item.id] ?? item.tags ?? []
              return (
                <div
                  key={item.id}
                  onClick={(event) => {
                    if (event.ctrlKey || event.metaKey) {
                      onToggleSelect?.(item.id)
                      return
                    }
                    onSelect?.(item)
                  }}
                  onContextMenu={(event) => openContextMenu(event, item)}
                  className={`relative flex flex-col items-center p-3 rounded-xl border cursor-pointer transition-all group ${selectedId === item.id ? 'border-vault-accent/50 bg-vault-accent/10' : ''} ${isMultiSelected ? 'border-vault-purple/50 bg-vault-purple/10' : ''} ${!selectedId && !isMultiSelected ? 'border-vault-border hover:border-vault-accent/30 hover:bg-vault-surface' : ''}`}
                >
                  {isMultiSelected && (
                    <div className="absolute top-2 left-2 w-4 h-4 rounded bg-vault-purple flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {starredIds?.has(item.id) && (
                    <svg className="absolute top-2 right-2 w-3.5 h-3.5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  )}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${item.type === 'folder' ? 'bg-vault-accent/10' : 'bg-vault-bg border border-vault-border'}`}>
                    {item.type === 'folder' ? (
                      <svg className="w-5 h-5 text-vault-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    ) : (
                      <svg className={`w-5 h-5 ${getFileColor(item.name)}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-vault-text text-xs font-mono text-center truncate w-full">{item.name}</span>
                  {item.size && <span className="text-vault-muted text-xs mt-0.5">{item.size}</span>}
                  {tags.length > 0 && <span className="text-vault-purple text-xs mt-0.5 truncate w-full text-center">{tags[0]}</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {contextMenu && (
        <div
          className="fixed z-40 w-56 rounded-xl border border-vault-border bg-vault-surface shadow-2xl overflow-hidden"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="px-3 py-2 border-b border-vault-border bg-vault-bg/60">
            <div className="text-vault-text text-xs font-semibold truncate">{contextMenu.item.name}</div>
            <div className="text-vault-muted text-[11px] truncate">{contextMenu.item.department ?? contextMenu.item.workspace}</div>
          </div>
          <div className="py-1">
            {contextActions.map((action) => (
              <button
                key={action.label}
                onClick={() => {
                  action.onClick()
                  setContextMenu(null)
                }}
                className={`w-full text-left px-3 py-2 text-xs transition-colors ${action.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-vault-muted hover:bg-vault-bg hover:text-vault-text'}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
