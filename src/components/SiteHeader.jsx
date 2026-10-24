import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Upload } from 'lucide-react'
import Logo from './Logo.jsx'
import LangSwap from './LangSwap.jsx'
import { LangSwitch, ContactPill } from './Controls.jsx'
import { useApp } from '../store.jsx'

/* 全站统一顶部栏：与首页逐像素一致
   - 首页直接使用，不加跳转
   - 二级页传入 brandLink，品牌区可点回首页（外观不变）
   - publish 在品牌右侧加入「发布」胶囊，仅仓库页使用 */
export default function SiteHeader({ delay = 0.35, brandLink = false, publish = false }) {
  const { t, staticMode } = useApp()

  const brand = (
    <div className="site-brand flex items-center gap-3">
      <Logo size={32} />
      <span className="text-sm font-medium tracking-wide">
        <span style={{ color: 'var(--c-text)' }}>ZHBO</span>
        <span style={{ color: 'var(--c-cyan)' }}>Wiki</span>
      </span>
    </div>
  )

  return (
    <motion.header
      className="site-header"
      initial={staticMode ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="site-head-left">
        {brandLink ? (
          <Link to="/" className="site-brand-link" aria-label="ZHBOWiki">
            {brand}
          </Link>
        ) : (
          brand
        )}

        {publish && (
          <button
            type="button"
            className="glass-pill publish-pill"
            title={t('nav.publish')}
            aria-label={t('nav.publish')}
          >
            <Upload size={13} strokeWidth={2} aria-hidden="true" />
            <LangSwap className="publish-text">{t('nav.publish')}</LangSwap>
          </button>
        )}
      </div>

      <div className="site-actions">
        <ContactPill />
        <LangSwitch />
      </div>
    </motion.header>
  )
}
