import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Download, Github, Terminal, User } from 'lucide-react'
import SiteHeader from '../components/SiteHeader.jsx'
import { getPlugin } from '../data/plugins.js'
import { useApp } from '../store.jsx'

/* 插件详情：卡片标题点进来后的完整说明页 */
export default function PluginDetail() {
  const { slug } = useParams()
  const { t, pick, lang } = useApp()
  const plugin = getPlugin(slug)

  if (!plugin) {
    return (
      <div className="repo-page">
        <SiteHeader brandLink />
        <main className="detail-main">
          <div className="glass-card detail-missing">
            <p className="font-display text-lg" style={{ color: 'var(--c-text)' }}>
              {t('detail.notFound')}
            </p>
            <p className="mt-2 text-sm muted">{t('detail.notFoundHint')}</p>
            <Link to="/plugins" className="btn-ghost mt-6">
              <ArrowLeft size={15} /> {t('detail.backToList')}
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="repo-page">
      <SiteHeader brandLink />

      <main className="detail-main">
        <Link to="/plugins" className="detail-back">
          <ArrowLeft size={13} /> {t('detail.back')}
        </Link>

        <header className="detail-head glass-card">
          <div className="detail-head-main">
            <h1 className="detail-title font-display">
              {pick(plugin.gameplay)}
              <span className="detail-name">
                {lang === 'zh' ? `（${plugin.name}）` : ` (${plugin.name})`}
              </span>
            </h1>
            <p className="detail-tagline">{pick(plugin.tagline)}</p>
            <p className="detail-desc">{pick(plugin.desc)}</p>

            <div className="detail-meta">
              <span className="chip">v{plugin.version}</span>
              {plugin.server.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
              <span className="chip">{plugin.mc}</span>
              <span className="chip">{t(`status.${plugin.status}`)}</span>
              <span className="chip detail-author-chip">
                <User size={12} /> {plugin.author}
              </span>
            </div>
          </div>

          <div className="detail-actions">
            <a
              className="btn-primary"
              href="#"
              onClick={(e) => e.preventDefault()}
              title="示例按钮，后续接真实下载地址"
            >
              <Download size={15} /> {t('plugins.download')}
            </a>
            <a
              className="btn-ghost"
              href="#"
              onClick={(e) => e.preventDefault()}
              title="示例链接，后续填入真实仓库地址"
            >
              <Github size={15} /> {t('detail.repo')}
            </a>
          </div>
        </header>

        <section className="detail-section">
          <h2 className="section-title text-xl">{t('detail.features')}</h2>
          <div className="detail-features">
            {plugin.features.map((f) => (
              <div key={pick(f.title)} className="glass-card detail-feature">
                <Check size={16} className="detail-check" />
                <div>
                  <h3 className="detail-feature-title font-display">{pick(f.title)}</h3>
                  <p className="detail-feature-text">{pick(f.text)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="detail-section">
          <h2 className="section-title text-xl">{t('detail.install')}</h2>
          <ol className="detail-steps">
            {pick(plugin.install).map((step, i) => (
              <li key={step} className="glass detail-step">
                <span className="detail-step-num font-display">{i + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="detail-section">
          <h2 className="section-title text-xl">{t('detail.commands')}</h2>
          <div className="glass detail-table-wrap">
            <table className="detail-table">
              <thead>
                <tr>
                  <th>{t('detail.command')}</th>
                  <th>{t('detail.description')}</th>
                  <th>{t('detail.permission')}</th>
                </tr>
              </thead>
              <tbody>
                {plugin.commands.map((c) => (
                  <tr key={c.cmd}>
                    <td className="detail-cmd">{c.cmd}</td>
                    <td className="detail-cmd-desc">{pick(c.desc)}</td>
                    <td className="detail-perm">{c.perm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="detail-section">
          <h2 className="section-title text-xl">{t('detail.config')}</h2>
          <div className="glass detail-config">
            <div className="detail-config-bar">
              <Terminal size={12} /> config.yml
            </div>
            <pre>
              <code>{plugin.config}</code>
            </pre>
          </div>
        </section>
      </main>

      <footer className="site-footer text-center text-[11px] tracking-wide" style={{ color: 'var(--c-muted)' }}>
        © {new Date().getFullYear()} ZHBOWiki
      </footer>
    </div>
  )
}
