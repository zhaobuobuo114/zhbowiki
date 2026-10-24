import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Download, Github, User } from 'lucide-react'
import LangSwap from './LangSwap.jsx'
import { useLiquidLight } from '../hooks/useLiquidLight.js'
import { useApp } from '../store.jsx'

/* 下载量格式化：18400 → 18.4k */
function formatDownloads(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

/* 仓库卡片
   第一行：玩法（插件名）        版本号 + 服务端标签
   第二行：玩法说明              下载按钮
   第三行：游戏版本 + 类型标签    作者 + GitHub 详情
   液态玻璃：光源跟随鼠标，速度决定亮度；离哪条边近，哪条边反光 */
export default function RepoCard({ plugin, flash = false }) {
  const { t, pick, lang, staticMode } = useApp()
  const cardRef = useRef(null)
  const lightHandlers = useLiquidLight(cardRef, { enabled: !staticMode })
  const tags = pick(plugin.tags) || []

  return (
    <article
      id={`plugin-${plugin.slug}`}
      ref={cardRef}
      className="repo-card glass-card"
      data-flash={flash ? '1' : '0'}
      {...lightHandlers}
    >
      {/* 四条边的反光：只有光源照到的边才亮 */}
      <span className="liquid-edge liquid-edge-top" aria-hidden="true" />
      <span className="liquid-edge liquid-edge-right" aria-hidden="true" />
      <span className="liquid-edge liquid-edge-bottom" aria-hidden="true" />
      <span className="liquid-edge liquid-edge-left" aria-hidden="true" />

      {/* 整块内容参与中英切换的模糊淡入淡出 */}
      <LangSwap block className="repo-card-inner">
        <div className="repo-card-top">
          <h3 className="repo-card-title font-display">
            <Link to={`/plugins/${plugin.slug}`} className="repo-card-title-link">
              {pick(plugin.gameplay)}
            </Link>
            <span className="repo-card-name">
              {lang === 'zh' ? `（${plugin.name}）` : ` (${plugin.name})`}
            </span>
          </h3>

          <div className="repo-card-badges">
            <span className="repo-ver">v{plugin.version}</span>
            {plugin.server.map((s) => (
              <span
                key={s}
                className={`repo-srv ${s === 'Fabric' ? 'repo-srv-fabric' : 'repo-srv-paper'}`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="repo-card-body">
          <p className="repo-card-desc">{pick(plugin.desc)}</p>
          <a
            className="repo-dl"
            href="#"
            onClick={(e) => e.preventDefault()}
            title="示例按钮，后续接真实下载地址"
          >
            <Download size={14} strokeWidth={2.1} />
            <span>{t('plugins.download')}</span>
            <span className="repo-dl-count">{formatDownloads(plugin.downloads)}</span>
          </a>
        </div>

        <div className="repo-card-foot">
          <div className="repo-tags">
            <span className="repo-tag repo-tag-mc">{plugin.mc}</span>
            {tags.map((tag) => (
              <span key={tag} className="repo-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="repo-social">
            <span className="repo-author">
              <User size={12} strokeWidth={1.9} />
              {plugin.author}
            </span>
            <a
              className="repo-gh"
              href="#"
              onClick={(e) => e.preventDefault()}
              title={plugin.github}
              aria-label={`${t('plugins.viewDetail')} · ${plugin.github}`}
            >
              <Github size={13} strokeWidth={1.9} />
              <span className="repo-gh-text">{t('plugins.viewDetail')}</span>
            </a>
          </div>
        </div>
      </LangSwap>
    </article>
  )
}
