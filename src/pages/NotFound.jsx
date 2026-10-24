import { Link } from 'react-router-dom'
import { ArrowLeft, Boxes } from 'lucide-react'
import SiteHeader from '../components/SiteHeader.jsx'
import { useApp } from '../store.jsx'

/* 未匹配路由：真实地址不存在时给一个可返回的落点 */
export default function NotFound() {
  const { t } = useApp()

  return (
    <div className="repo-page">
      <SiteHeader brandLink />
      <main className="notfound-main">
        <div className="glass-card notfound-card">
          <p className="notfound-code font-display">404</p>
          <h1 className="notfound-title font-display">{t('notFound.title')}</h1>
          <p className="notfound-hint">{t('notFound.hint')}</p>
          <div className="notfound-actions">
            <Link to="/" className="btn-primary">
              <ArrowLeft size={15} /> {t('notFound.home')}
            </Link>
            <Link to="/plugins" className="btn-ghost">
              <Boxes size={15} /> {t('notFound.plugins')}
            </Link>
          </div>
        </div>
      </main>
      <footer
        className="site-footer text-center text-[11px] tracking-wide"
        style={{ color: 'var(--c-muted)' }}
      >
        © {new Date().getFullYear()} ZHBOWiki
      </footer>
    </div>
  )
}
