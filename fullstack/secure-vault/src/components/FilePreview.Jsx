export default function FilePreview({ file, onClose }) {
  const ext = file.name.split('.').pop()?.toLowerCase()
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)
  const isPdf = ext === 'pdf'
  const isText = ['txt', 'md', 'js', 'jsx', 'ts', 'tsx', 'json', 'csv', 'xml', 'html', 'css'].includes(ext)
  const isDoc = ['docx', 'doc'].includes(ext)
  const isSheet = ['xlsx', 'xls'].includes(ext)

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6" onClick={onClose}>
      <div className="bg-vault-surface border border-vault-border rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-vault-border shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-vault-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-vault-text text-sm font-mono">{file.name}</span>
            <span className="text-vault-muted text-xs">{file.size}</span>
          </div>
          <button onClick={onClose} className="text-vault-muted hover:text-vault-text transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview body */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-6 min-h-0">
          {isImage && (
            <div className="text-center">
              <div className="w-64 h-64 rounded-xl bg-vault-bg border border-vault-border flex flex-col items-center justify-center gap-3 mx-auto">
                <svg className="w-16 h-16 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-vault-muted text-xs">Image Preview</span>
                <span className="text-vault-muted/50 text-xs font-mono">{file.name}</span>
              </div>
              <p className="text-vault-muted text-xs mt-3">Thumbnail viewer — {file.size}</p>
            </div>
          )}

          {isPdf && (
            <div className="w-full h-96 rounded-xl bg-vault-bg border border-vault-border flex flex-col items-center justify-center gap-3">
              <svg className="w-16 h-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-vault-text text-sm font-mono">{file.name}</span>
              <span className="text-vault-muted text-xs">PDF Document · {file.size}</span>
              <div className="mt-2 px-4 py-2 rounded-lg bg-vault-surface border border-vault-border text-vault-muted text-xs text-center max-w-xs">
                Inline PDF rendering available when file is loaded from server.<br />
                <span className="text-vault-accent">Click to open in new tab →</span>
              </div>
            </div>
          )}

          {(isText || isDoc || isSheet) && (
            <div className="w-full h-80 rounded-xl bg-vault-bg border border-vault-border p-4 overflow-auto font-mono text-xs text-vault-muted">
              <div className="space-y-1">
                {isDoc && (
                  <>
                    <p className="text-vault-text font-semibold">SETTLEMENT AGREEMENT</p>
                    <p className="text-vault-muted/50">─────────────────────────────</p>
                    <p>This Settlement Agreement ("Agreement") is entered into as of the date last signed below, by and between the parties identified herein.</p>
                    <p className="mt-2">1. PARTIES. The parties to this Agreement are:</p>
                    <p className="pl-4">a) Plaintiff: [Client Name], hereinafter referred to as "Plaintiff"</p>
                    <p className="pl-4">b) Defendant: [Opposing Party], hereinafter referred to as "Defendant"</p>
                    <p className="mt-2">2. RECITALS. WHEREAS, a dispute has arisen between the parties...</p>
                    <p className="mt-2 text-vault-muted/50">[Document preview — {file.size}]</p>
                  </>
                )}
                {isSheet && (
                  <>
                    <p className="text-vault-text font-semibold">INVOICE SPREADSHEET</p>
                    <p className="text-vault-muted/50">─────────────────────────────</p>
                    <div className="grid grid-cols-4 gap-4 mt-2">
                      {['Invoice #', 'Client', 'Amount', 'Status'].map(h => <span key={h} className="text-vault-accent">{h}</span>)}
                      {['INV-001', 'Acme Corp', '$12,500', 'Paid'].map(c => <span key={c}>{c}</span>)}
                      {['INV-002', 'Beta LLC', '$8,200', 'Pending'].map(c => <span key={c}>{c}</span>)}
                      {['INV-003', 'Gamma Inc', '$31,000', 'Overdue'].map(c => <span key={c} className="text-red-400">{c}</span>)}
                    </div>
                    <p className="mt-2 text-vault-muted/50">[Spreadsheet preview — {file.size}]</p>
                  </>
                )}
                {isText && (
                  <>
                    <p className="text-vault-text">File: {file.name}</p>
                    <p className="text-vault-muted/50">─────────────────────────────</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <p className="mt-2 text-vault-muted/50">[Text preview — {file.size}]</p>
                  </>
                )}
              </div>
            </div>
          )}

          {!isImage && !isPdf && !isText && !isDoc && !isSheet && (
            <div className="text-center">
              <div className="w-24 h-24 rounded-xl bg-vault-bg border border-vault-border flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-vault-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-vault-muted text-sm">Preview not available for .{ext} files</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
