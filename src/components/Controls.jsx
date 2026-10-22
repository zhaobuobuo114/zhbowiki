import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { useApp } from '../store.jsx'
import { useGlassHover } from '../hooks/useGlassHover.js'
import { SWITCH_ANIM, SWITCH_EXIT } from '../lib/switchAnim.js'

const LANGS = [
  { id: 'zh', label: '中文' },
  { id: 'en', label: 'EN' }
]

/* 联系我们胶囊：与语言胶囊同一套玻璃质感与交互（不位移，只跟随高光 + hover 果冻）
   文案切换复用副标题的模糊淡入动画，胶囊宽度同步平滑伸缩
   目前为占位按钮，后续接联系入口（邮件 / 面板）时加 onClick 即可 */
export function ContactPill() {
  const { t, lang, staticMode } = useApp()
  const { wrapRef, pillRef } = useGlassHover(0)
  const mirrorRef = useRef(null)
  const [pillW, setPillW] = useState(null)

  // 用隐藏镜像量出当前文案的自然宽度，驱动胶囊宽度平滑过渡
  useLayoutEffect(() => {
    const mirror = mirrorRef.current
    const pill = pillRef.current
    if (!mirror || !pill) return
    const cs = getComputedStyle(pill)
    const pad =
      (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0)
    const border =
      (parseFloat(cs.borderLeftWidth) || 0) + (parseFloat(cs.borderRightWidth) || 0)
    setPillW(Math.round(mirror.offsetWidth + pad + border))
  }, [lang, pillRef])

  return (
    <div ref={wrapRef} className="pointer-events-none">
      <motion.button
        ref={pillRef}
        type="button"
        className="glass-pill lang-pill contact-pill pointer-events-auto relative"
        aria-label={t('nav.contact')}
        animate={{ width: pillW ?? 'auto' }}
        transition={{ width: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] } }}
      >
        {/* 隐藏镜像：与真实内容同结构同样式，只用来量宽度 */}
        <div ref={mirrorRef} className="contact-mirror" aria-hidden="true">
          <Mail size={12} strokeWidth={1.9} />
          <span>{t('nav.contact')}</span>
        </div>

        <Mail size={12} strokeWidth={1.9} aria-hidden="true" />

        {/* 与副标题完全一致：模糊淡出 → 模糊淡入，先出后进 */}
        <AnimatePresence mode="wait">
          <motion.span
            key={lang}
            {...SWITCH_ANIM}
            initial={staticMode ? false : SWITCH_ANIM.initial}
            exit={SWITCH_EXIT}
            transition={{ duration: 0.17, ease: 'easeOut', delay: 0 }}
          >
            {t('nav.contact')}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

export function LangSwitch() {
  const { lang, setLang } = useApp()
  // 0 = 不跟随鼠标位移，只保留边缘高光跟随
  const { wrapRef, pillRef } = useGlassHover(0)
  const btnRefs = useRef({})
  const indRef = useRef(null)

  // 首帧后启用动画（首次加载直接定位，不播放过渡）
  const readyRef = useRef(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      readyRef.current = true
    })
    return () => cancelAnimationFrame(id)
  }, [])

  // 蓝色小胶囊：滑动 + 果冻拉长回弹（WAAPI 关键帧，可平滑改道）
  useLayoutEffect(() => {
    const btn = btnRefs.current[lang]
    const el = indRef.current
    if (!btn || !el) return

    const tl = btn.offsetLeft
    const tw = btn.offsetWidth

    if (!readyRef.current) {
      // 首次：直接定位
      el.style.left = `${tl}px`
      el.style.width = `${tw}px`
      return
    }

    const cl = parseFloat(el.style.left) || tl
    const cw = parseFloat(el.style.width) || tw
    // 过渡中拉长的最大宽度（明显果冻感）
    const stretch = Math.max(cw, tw) + 14

    if (el._langAnim) el._langAnim.cancel()
    el._langAnim = el.animate(
      [
        { left: `${cl}px`, width: `${cw}px`, offset: 0 },
        { left: `${(cl + tl) / 2}px`, width: `${stretch}px`, offset: 0.5 },
        { left: `${tl}px`, width: `${tw}px`, offset: 1 }
      ],
      { duration: 400, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
    )
    // 最终定位值（动画结束后生效）
    el.style.left = `${tl}px`
    el.style.width = `${tw}px`

    // 切换瞬间微光脉冲
    el.classList.remove('lang-pulse')
    void el.offsetWidth
    el.classList.add('lang-pulse')
  }, [lang])

  return (
    <div ref={wrapRef} className="pointer-events-none">
      <div
        ref={pillRef}
        className="glass-pill lang-pill pointer-events-auto relative"
        role="group"
        aria-label="Language"
      >
        {/* 蓝色滑动胶囊（选中指示器） */}
        <div
          ref={indRef}
          className="lang-indicator"
          style={{ left: 0, width: 0 }}
        />
        {LANGS.map((l) => (
          <button
            key={l.id}
            ref={(el) => {
              btnRefs.current[l.id] = el
            }}
            type="button"
            onClick={() => setLang(l.id)}
            className={`relative z-[1] rounded-full px-3 py-1 text-[11px] transition-colors duration-300 ${
              lang === l.id ? 'text-neon' : 'text-muted hover:text-ink'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  )
}
