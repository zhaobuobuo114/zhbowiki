import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Download } from 'lucide-react'
import { accentHex, pluginIcons } from '../icons.jsx'
import { useApp } from '../store.jsx'

export default function PluginCard({ plugin, compact = false }) {
  const { pick, t } = useApp()
  const Icon = pluginIcons[plugin.icon] || pluginIcons.book
  const color = accentHex[plugin.accent] || accentHex.cyan

  return (
    <Link to={`/plugins/${plugin.slug}`} className="group block h-full">
      <motion.article
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="glass-card relative flex h-full flex-col overflow-hidden p-5"
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-10 blur-2xl transition group-hover:opacity-20"
          style={{ background: color }}
        />

        <div className="flex items-start justify-between gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl border"
            style={{
              borderColor: `${color}55`,
              background: `${color}14`,
              color
            }}
          >
            <Icon size={18} />
          </div>
          <span className="font-display text-[10px] tracking-[0.18em] text-muted">
            v{plugin.version}
          </span>
        </div>

        <h3 className="mt-4 font-display text-lg font-semibold tracking-wide text-ink">
          {plugin.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {pick(plugin.tagline)}
        </p>

        {!compact && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {plugin.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-5 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <Download size={12} />
            {plugin.downloads}
          </span>
          <span className="flex items-center gap-1 text-neon opacity-0 transition group-hover:opacity-100">
            {t('common.readMore')}
            <ArrowUpRight size={13} />
          </span>
        </div>
      </motion.article>
    </Link>
  )
}
