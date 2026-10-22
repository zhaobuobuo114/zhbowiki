import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { plugins } from '../data/plugins.js'
import { useApp } from '../store.jsx'
import PluginCard from '../components/PluginCard.jsx'
import { Reveal } from '../components/Motion.jsx'

const PLATFORMS = ['all', 'Paper', 'Fabric', 'Both']

export default function Plugins() {
  const { t, pick, staticMode } = useApp()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')
  const [platform, setPlatform] = useState('all')

  const list = useMemo(() => {
    const key = q.trim().toLowerCase()
    return plugins.filter((p) => {
      const matchQ =
        !key ||
        [p.name, p.slug, p.platform, pick(p.tagline), pick(p.desc), ...(p.tags || [])]
          .join(' ')
          .toLowerCase()
          .includes(key)
      const matchP = platform === 'all' || p.platform === platform
      return matchQ && matchP
    })
  }, [q, platform, pick])

  return (
    <div>
      <Reveal>
        <p className="font-display text-[11px] tracking-[0.35em] text-neon">
          LIBRARY
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-wide text-ink md:text-4xl">
          {t('plugins.title')}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          {t('plugins.sub')}
        </p>
      </Reveal>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="glass flex h-11 w-full items-center gap-3 rounded-full px-4 md:max-w-sm">
          <Search size={16} className="text-neon" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setParams(e.target.value ? { q: e.target.value } : {})
            }}
            placeholder={t('common.searchPlaceholder')}
            className="h-full w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(p)}
              className={`rounded-full border px-4 py-1.5 text-xs transition ${
                platform === p
                  ? 'border-neon/60 bg-[rgba(0,240,255,0.12)] text-neon'
                  : 'border-line text-muted hover:text-ink'
              }`}
            >
              {p === 'all' ? t('plugins.all') : p}
            </button>
          ))}
          <span className="flex items-center px-2 text-xs text-muted">
            {list.length} {t('plugins.count')}
          </span>
        </div>
      </div>

      <motion.div layout className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <motion.div
              key={p.slug}
              layout
              initial={staticMode ? false : { opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <PluginCard plugin={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {list.length === 0 && (
        <div className="glass mt-8 rounded-2xl px-6 py-16 text-center">
          <p className="font-display text-sm tracking-wide text-muted">
            {t('common.empty')}
          </p>
        </div>
      )}
    </div>
  )
}
