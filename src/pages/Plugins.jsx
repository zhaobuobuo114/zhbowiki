import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import SiteHeader from '../components/SiteHeader.jsx'
import LangSwap from '../components/LangSwap.jsx'
import RepoCard from '../components/RepoCard.jsx'
import { useLiquidLight } from '../hooks/useLiquidLight.js'
import { plugins } from '../data/plugins.js'
import { useApp } from '../store.jsx'

const SERVERS = ['all', 'Paper', 'Fabric']
const SORTS = ['updated', 'downloads']
const EASE_OUT = [0.22, 1, 0.36, 1]

/* 二级页：插件仓库
   顶部栏与首页完全一致；左栏搜索 + 筛选 + 插件名索引，右栏插件卡片 */
export default function Plugins() {
  const { t, pick, lang, staticMode } = useApp()
  const [q, setQ] = useState('')
  const [server, setServer] = useState('all')
  const [sort, setSort] = useState('updated')
  const [tagKeys, setTagKeys] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [active, setActive] = useState(null)

  const popRef = useRef(null)
  const timerRef = useRef(0)
  const searchRef = useRef(null)
  const filterBtnRef = useRef(null)
  const searchLight = useLiquidLight(searchRef, { enabled: !staticMode })
  const filterLight = useLiquidLight(filterBtnRef, {
    enabled: !staticMode,
    radius: 50,
    entryBoost: 0.6
  })
  /* 首屏进场只播一次，后续筛选/排序新增的卡片不再延迟 */
  const firstRef = useRef(true)

  useEffect(() => {
    const id = setTimeout(() => {
      firstRef.current = false
    }, 1400)
    return () => clearTimeout(id)
  }, [])

  /* 点击筛选面板外部 / 按 Esc 关闭 */
  useEffect(() => {
    const onDown = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setFilterOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setFilterOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      clearTimeout(timerRef.current)
    }
  }, [])

  /* 标签注册表：用中文标签作为稳定 key，切语言时只换显示文案 */
  const tagIndex = useMemo(() => {
    const map = new Map()
    plugins.forEach((p) => {
      const zh = p.tags?.zh || []
      const en = p.tags?.en || []
      zh.forEach((key, i) => {
        if (!map.has(key)) map.set(key, { key, zh: key, en: en[i] || key })
      })
    })
    return [...map.values()]
  }, [])

  const list = useMemo(() => {
    const key = q.trim().toLowerCase()
    const filtered = plugins.filter((p) => {
      const matchQ =
        !key ||
        [p.name, pick(p.gameplay), pick(p.tagline), pick(p.desc), ...pick(p.tags), p.author, p.mc]
          .join(' ')
          .toLowerCase()
          .includes(key)
      const matchS = server === 'all' || p.server.includes(server)
      const matchT =
        tagKeys.length === 0 || (p.tags?.zh || []).some((tag) => tagKeys.includes(tag))
      return matchQ && matchS && matchT
    })

    return [...filtered].sort((a, b) =>
      sort === 'downloads'
        ? b.downloads - a.downloads
        : a.updated < b.updated
          ? 1
          : -1
    )
  }, [q, server, sort, tagKeys, pick])

  const filterActive = server !== 'all' || sort !== 'updated' || tagKeys.length > 0

  /* 左栏插件名：滚到对应卡片并高亮一下，作为页内快捷入口 */
  const jump = (slug) => {
    document.getElementById(`plugin-${slug}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
    setActive(slug)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setActive(null), 1600)
  }

  const toggleTag = (key) => {
    setTagKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const reset = () => {
    setServer('all')
    setSort('updated')
    setTagKeys([])
  }

  return (
    <div className="repo-page">
      <SiteHeader brandLink publish />

      <main className="repo-main">
        <motion.aside
          className="repo-rail"
          initial={staticMode ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.45, ease: EASE_OUT }}
        >
          <div className="repo-search-row" ref={popRef}>
            <label className="repo-search" ref={searchRef} {...searchLight}>
              {/* 搜索框的四边反光，与卡片同一套液态玻璃光源 */}
              <span className="liquid-edge liquid-edge-top" aria-hidden="true" />
              <span className="liquid-edge liquid-edge-right" aria-hidden="true" />
              <span className="liquid-edge liquid-edge-bottom" aria-hidden="true" />
              <span className="liquid-edge liquid-edge-left" aria-hidden="true" />

              <Search size={14} strokeWidth={2} aria-hidden="true" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('plugins.search')}
                aria-label={t('plugins.search')}
              />
              {q && (
                <button
                  type="button"
                  className="repo-search-clear"
                  onClick={() => setQ('')}
                  aria-label="Clear"
                >
                  <X size={12} />
                </button>
              )}
            </label>

            <button
              type="button"
              ref={filterBtnRef}
              className="repo-filter-btn"
              data-open={filterOpen ? '1' : '0'}
              data-active={filterActive ? '1' : '0'}
              onClick={() => setFilterOpen((v) => !v)}
              aria-label={t('plugins.filter')}
              aria-expanded={filterOpen}
              {...filterLight}
            >
              <span className="liquid-edge liquid-edge-top" aria-hidden="true" />
              <span className="liquid-edge liquid-edge-right" aria-hidden="true" />
              <span className="liquid-edge liquid-edge-bottom" aria-hidden="true" />
              <span className="liquid-edge liquid-edge-left" aria-hidden="true" />
              <SlidersHorizontal size={15} strokeWidth={1.9} />
            </button>

            {filterOpen && (
              <div className="repo-filter">
                <div>
                  <p className="repo-filter-label">
                    <LangSwap>{t('plugins.server')}</LangSwap>
                  </p>
                  <div className="repo-filter-group">
                    {SERVERS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="repo-filter-chip"
                        data-on={server === s ? '1' : '0'}
                        onClick={() => setServer(s)}
                      >
                        <LangSwap>{s === 'all' ? t('plugins.all') : s}</LangSwap>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="repo-filter-block">
                  <p className="repo-filter-label">
                    <LangSwap>{t('plugins.tags')}</LangSwap>
                  </p>
                  <div className="repo-filter-group">
                    {tagIndex.map((tag) => (
                      <button
                        key={tag.key}
                        type="button"
                        className="repo-filter-chip"
                        data-on={tagKeys.includes(tag.key) ? '1' : '0'}
                        onClick={() => toggleTag(tag.key)}
                      >
                        <LangSwap>{lang === 'zh' ? tag.zh : tag.en}</LangSwap>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="repo-filter-block">
                  <p className="repo-filter-label">
                    <LangSwap>{t('plugins.sort')}</LangSwap>
                  </p>
                  <div className="repo-filter-group">
                    {SORTS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="repo-filter-chip"
                        data-on={sort === s ? '1' : '0'}
                        onClick={() => setSort(s)}
                      >
                        <LangSwap>
                          {t(s === 'downloads' ? 'plugins.sortDownloads' : 'plugins.sortUpdated')}
                        </LangSwap>
                      </button>
                    ))}
                  </div>
                </div>

                <button type="button" className="repo-filter-reset" onClick={reset}>
                  <LangSwap>{t('plugins.reset')}</LangSwap>
                </button>
              </div>
            )}
          </div>

          <p className="repo-count">
            {list.length} <LangSwap>{t('plugins.count')}</LangSwap>
          </p>

          <p className="repo-index-label">
            <LangSwap>{t('plugins.index')}</LangSwap>
          </p>
          <nav className="repo-index">
            {list.map((p) => (
              <button
                key={p.slug}
                type="button"
                data-active={active === p.slug ? '1' : '0'}
                onClick={() => jump(p.slug)}
              >
                {p.name}
              </button>
            ))}
            {list.length === 0 && <span className="repo-index-empty">—</span>}
          </nav>
        </motion.aside>

        <section className="repo-list">
          <h1 className="sr-only">{t('plugins.title')}</h1>

          {list.map((p, i) => (
            <motion.div
              key={p.slug}
              className="repo-card-wrap"
              initial={
                staticMode ? false : { opacity: 0, y: 12, filter: 'blur(6px)' }
              }
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.55,
                delay: firstRef.current ? 0.5 + i * 0.06 : 0,
                ease: EASE_OUT
              }}
            >
              <RepoCard plugin={p} flash={active === p.slug} />
            </motion.div>
          ))}

          {list.length === 0 && (
            <div className="repo-empty glass-card">
              <p className="repo-empty-title font-display">
                <LangSwap>{t('plugins.empty')}</LangSwap>
              </p>
              <p className="repo-empty-hint">
                <LangSwap>{t('plugins.emptyHint')}</LangSwap>
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer text-center text-[11px] tracking-wide" style={{ color: 'var(--c-muted)' }}>
        © {new Date().getFullYear()} ZHBOWiki
      </footer>
    </div>
  )
}
