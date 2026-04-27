import { useState, useEffect } from 'react'

let _addToast = null
export function toast(message, type = 'info') {
  _addToast?.({ message, type, id: Date.now() + Math.random() })
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    _addToast = (t) => {
      setToasts((prev) => [...prev.slice(-4), t])
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 3500)
    }
    return () => { _addToast = null }
  }, [])

  const icons = {
    info: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    success: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    warning: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    error: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  }
  const colors = {
    info: 'border-vault-accent/40 text-vault-accent',
    success: 'border-green-500/40 text-green-400',
    warning: 'border-yellow-500/40 text-yellow-400',
    error: 'border-red-500/40 text-red-400',
  }

  return (
    <div className="fixed bottom-8 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg bg-vault-surface border ${colors[t.type]} text-vault-text text-xs font-mono shadow-xl animate-fade-in`}>
          <svg className={`w-4 h-4 shrink-0 ${colors[t.type]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">{icons[t.type]}</svg>
          {t.message}
        </div>
      ))}
    </div>
  )
}
