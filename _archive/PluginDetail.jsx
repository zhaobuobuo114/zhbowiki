import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Download,
  Github,
  Terminal
} from 'lucide-react'
import { getPlugin, plugins } from '../data/plugins.js'
import { accentHex, pluginIcons } from '../icons.jsx'
import { useApp } from '../store.jsx'
import { Reveal, StaggerGroup, StaggerItem } from '../components/Motion.jsx'
import PluginCard from '../components/PluginCard.jsx'

export default function PluginDetail() {
  const { slug } = useParams()
  const { t, pick, staticMode } = useApp()
  const plugin = getPlugin(slug)

  if (!plugin) {
    return (
      <div className="glass rounded-2xl px-6 py-20 text-center">
        <p className="font-display text-lg text-ink">404</p>
        <p className="mt-2 text-sm text-muted">{t('common.empty')}</p>
        <Link to="/plugins" className="btn-ghost mt-6">
          <ArrowLeft size={15} /> {t('common.back')}
        </Link>
      </div>
    )
  }

  const Icon = pluginIcons[plugin.icon] || pluginIcons.book
  const color = accentHex[plugin.accent] || accentHex.cyan
  const related = plugins.filter((p) => p.slug !== plugin.slug).slice(0, 3)

  return (
    <div>
      <Link
        to="/plugins"
        className="inline-flex items-center gap-1.5 text-xs text-muted transition hover:text-neon"
      >
        <ArrowLeft size={13} /> {t('common.back')}
      </Link>

      <motion.header
        initial={staticMode ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative mt-5 overflow-hidden rounded-3xl p-6 md:p-8"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-25 blur-3xl"
          style={{ background: color }}
        />
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl border"
                style={{
                  borderColor: `${color}55`,
                  background: `${color}14`,
                  color
                }}
              >
                <Icon size={22} />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold tracking-wide text-ink md:text-3xl">
                  {plugin.name}
                </h1>
                <p className="mt-1 text-sm text-muted">{pick(plugin.tagline)}</p>
              </div>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
              {pick(plugin.desc)}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="chip">v{plugin.version}</span>
              <span className="chip">{plugin.platform}</span>
              <span className="chip">Minecraft {plugin.mc}</span>
              <span className="chip">
                {t(`status.${plugin.status}`)}
              </span>
              <span className="chip">{plugin.updated}</span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2">
            <a
              href={plugin.repo}
              target="_blank"
              rel="noreferrer"
              className="btn-primary px-6 py-2.5 text-sm"
            >
              <Download size={15} /> {t('common.download')}
            </a>
            <a
              href={plugin.repo}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost px-6 py-2.5 text-sm"
            >
              <Github size={15} /> {t('detail.repo')}
            </a>
          </div>
        </div>
      </motion.header>

      <section className="mt-12">
        <h2 className="section-title text-xl">{t('detail.features')}</h2>
        <StaggerGroup className="mt-5 grid gap-4 md:grid-cols-2">
          {plugin.features.map((f) => (
            <StaggerItem key={f.title}>
              <div className="glass-card flex h-full gap-3 p-5">
                <Check size={16} className="mt-1 shrink-0" style={{ color }} />
                <div>
                  <h3 className="font-display text-sm font-semibold tracking-wide text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {f.text}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="mt-12">
        <h2 className="section-title text-xl">{t('detail.install')}</h2>
        <ol className="mt-5 space-y-3">
          {plugin.install.map((step, i) => (
            <li key={step} className="glass flex gap-4 rounded-xl p-4">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-xs"
                style={{ background: `${color}1f`, color }}
              >
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-muted">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="section-title text-xl">{t('detail.commands')}</h2>
        <div className="glass mt-5 overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-[rgba(255,255,255,0.03)] text-xs text-muted">
              <tr>
                <th className="px-4 py-3 font-normal">Command</th>
                <th className="px-4 py-3 font-normal">Description</th>
                <th className="px-4 py-3 font-normal">Permission</th>
              </tr>
            </thead>
            <tbody>
              {plugin.commands.map((c) => (
                <tr key={c.cmd} className="border-t border-line">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-neon">
                    {c.cmd}
                  </td>
                  <td className="px-4 py-3 text-muted">{c.desc}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-muted">
                    {c.perm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="section-title text-xl">{t('detail.config')}</h2>
        <div className="glass mt-5 overflow-hidden rounded-2xl">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2 text-[11px] text-muted">
            <Terminal size={12} /> config.yml
          </div>
          <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-ink/90">
            <code>{plugin.config}</code>
          </pre>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="section-title text-xl">{t('detail.related')}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {related.map((p) => (
            <PluginCard key={p.slug} plugin={p} compact />
          ))}
        </div>
      </section>
    </div>
  )
}
