import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CornerDownLeft, Search } from 'lucide-react'
import { plugins } from '../data/plugins'
import { useApp } from '../store.jsx'

export default function SearchBox({ large = false }) {
  const { t, pick } = useApp()
  const [q, setQ] = useState('')
  const [focused, setFocused] = useState(false)
  const wrapRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const results = useMemo(() => {
    const key = q.trim().toLowerCase()
    if (!key) return []
    return plugins
      .filter((p) =>
        [p.name, p.slug, p.platform, pick(p.tagline), ...(p.tags || [])]
          .join(' ')
          .toLowerCase()
          .includes(key)
      )
      .slice(0, 5)
  }, [q, pick])

  const open = focused && q.trim().length > 0

  const submit = (e) => {
    e.preventDefault()
    navigate(`/plugins?q=${encodeURIComponent(q.trim())}`)
    setFocused(false)
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      <form onSubmit={submit}>
        <div
          className={`glass flex items-center gap-3 rounded-full border px-4 transition ${
            focused ? 'border-neon/60 shadow-neon' : ''
          } ${large ? 'h-14' : 'h-11'}`}
        >
          <Search size={large ? 20 : 17} className="shrink-0 text-neon/80" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={t('common.searchPlaceholder')}
            className="h-full w-full bg-transparent text-sm text-ink placeholder:text-muted/70 focus:outline-none"
          />
          <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted md:block">
            /
          </kbd>
        </div>
      </form>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="glass absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-2xl p-2"
          >
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted">
                {t('common.empty')}
              </div>
            ) : (
              results.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => {
                    navigate(`/plugins/${p.slug}`)
                    setFocused(false)
                  }}
                  className="flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left transition hover:bg-neon/10"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-ink">
                      {p.name}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {pick(p.tagline)}
                    </span>
                  </span>
                  <span className="chip shrink-0">{p.platform}</span>
                </button>
              ))
            )}
            <div className="mt-1 flex items-center justify-between border-t border-line/60 px-3 py-2 text-[11px] text-muted">
              <span>{results.length} / {plugins.length}</span>
              <span className="flex items-center gap-1">
                <CornerDownLeft size={12} /> Enter
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
