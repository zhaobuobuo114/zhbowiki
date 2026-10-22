import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Clock, Terminal } from 'lucide-react'
import { useApp } from '../store.jsx'
import { plugins } from '../data/plugins.js'
import { Reveal, StaggerGroup, StaggerItem } from '../components/Motion.jsx'
import PluginCard from '../components/PluginCard.jsx'

export default function Home() {
  const { t, pick, lang } = useApp()
  const featured = plugins.slice(0, 3)
  const recent = [...plugins]
    .sort((a, b) => (a.updated < b.updated ? 1 : -1))
    .slice(0, 4)

  const quick = [
    {
      icon: BookOpen,
      title: t('home.quickInstall'),
      desc: t('landing.platforms.paper.t'),
      to: '/plugins/cobbledex'
    },
    {
      icon: Terminal,
      title: t('home.quickCommands'),
      desc: '/dex · /shiny · /raid',
      to: '/plugins/cobbledex'
    },
    {
      icon: Clock,
      title: t('home.quickFaq'),
      desc: t('home.recent'),
      to: '/plugins'
    }
  ]

  return (
    <div>
      <Reveal>
        <p className="font-display text-[11px] tracking-[0.35em] text-neon">
          DASHBOARD
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-wide text-ink md:text-4xl">
          {t('home.title')}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          {t('home.sub')}
        </p>
      </Reveal>

      <section className="mt-12">
        <div className="flex items-end justify-between">
          <h2 className="section-title text-xl md:text-2xl">
            {t('home.featured')}
          </h2>
          <Link
            to="/plugins"
            className="flex items-center gap-1 text-xs text-neon transition hover:gap-2"
          >
            {t('common.viewAll')} <ArrowRight size={13} />
          </Link>
        </div>
        <StaggerGroup className="mt-5 grid gap-4 md:grid-cols-3">
          {featured.map((p) => (
            <StaggerItem key={p.slug} className="h-full">
              <PluginCard plugin={p} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="mt-14">
        <h2 className="section-title text-xl md:text-2xl">{t('home.recent')}</h2>
        <div className="mt-5 divide-y divide-line border-y border-line">
          {recent.map((p) => (
            <Link
              key={p.slug}
              to={`/plugins/${p.slug}`}
              className="group flex items-center justify-between gap-4 py-4 transition hover:bg-[rgba(0,240,255,0.03)]"
            >
              <div className="min-w-0">
                <p className="font-display text-sm tracking-wide text-ink group-hover:text-neon">
                  {p.name}
                </p>
                <p className="mt-1 truncate text-xs text-muted">
                  {pick(p.tagline)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-[11px] text-muted">
                <span className="chip">v{p.version}</span>
                <span>{p.updated}</span>
                <ArrowRight
                  size={14}
                  className="text-neon opacity-0 transition group-hover:opacity-100"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="section-title text-xl md:text-2xl">{t('home.quick')}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {quick.map(({ icon: Icon, title, desc, to }) => (
            <Link key={title} to={to} className="glass-card p-5">
              <Icon size={18} className="text-neon" />
              <p className="mt-3 font-display text-sm tracking-wide text-ink">
                {title}
              </p>
              <p className="mt-1 text-xs text-muted">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-12 text-[11px] text-muted">
        {lang === 'zh' ? '当前语言：中文' : lang.toUpperCase()}
      </p>
    </div>
  )
}
