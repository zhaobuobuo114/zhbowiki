import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from '../components/Logo.jsx'
import { LangSwitch, ContactPill } from '../components/Controls.jsx'
import { useApp } from '../store.jsx'
import { useGlassHover } from '../hooks/useGlassHover.js'

const TITLE = 'ZHBOWiki'.split('')

/* 文字切换动画参数：模糊 + 轻微位移，先出后进 */
const SWITCH_ANIM = {
  initial: { opacity: 0, y: 4, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -4, filter: 'blur(8px)' }
}

/* 退场单独设定时长：避免继承入场的首次延迟（否则切换会多等半秒） */
const SWITCH_EXIT = {
  ...SWITCH_ANIM.exit,
  transition: { duration: 0.17, ease: 'easeOut', delay: 0 }
}

/* 按钮补位的弹簧参数：按真实时间积分，任何刷新率下都是约 0.5s、约 3% 过冲 */
const SHIFT_SPRING_K = 46
const SHIFT_SPRING_C = 10.1
const SHIFT_SUB_DT = 1 / 240 // 固定子步长，保证不同帧率轨迹一致

/* 挂载探针：新副标题一挂载（DOM 已变、尚未绘制）就通知按钮补位，避免闪一帧 */
function ShiftProbe({ onMount }) {
  useLayoutEffect(() => {
    onMount?.()
    // 只在自身挂载（语言切换、新文字出现）时触发一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

/* 胶囊 CTA 按钮：iOS 毛玻璃 + 果冻弹性 + 吸附感 + 边缘高光跟随鼠标 */
function CtaButton({ staticMode, shiftApi }) {
  const { t, lang } = useApp()
  const { wrapRef, pillRef } = useGlassHover(5)
  const measureRef = useRef(null)
  const firstRef = useRef(true)
  const [btnW, setBtnW] = useState(null)

  /* 副标题换行数变化（中↔英）会让按钮瞬移，这里把瞬移补偿成弹簧滑行 */
  const shiftRef = useRef(null)

  useLayoutEffect(() => {
    const el = shiftRef.current
    if (!el) return

    /* 不受 transform 影响的自然位置（offsetTop 链），用来算布局位移 */
    const naturalTop = () => {
      let v = 0
      let n = el
      while (n) {
        v += n.offsetTop
        n = n.offsetParent
      }
      return v
    }

    let last = naturalTop()
    let y = 0
    let vel = 0
    let raf = 0
    let prevTs = 0

    const apply = () => {
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`
    }

    /* 物理弹簧：按真实帧间隔积分（子步长 1/240），并限幅防切标签页跳变 */
    const step = (ts) => {
      if (!prevTs) prevTs = ts
      let frameDt = (ts - prevTs) / 1000
      prevTs = ts
      if (!(frameDt > 0)) frameDt = 1 / 60
      frameDt = Math.min(frameDt, 0.05)

      let rem = frameDt
      while (rem > 1e-6) {
        const h = Math.min(SHIFT_SUB_DT, rem)
        vel += (-SHIFT_SPRING_K * y - SHIFT_SPRING_C * vel) * h
        y += vel * h
        rem -= h
      }

      // 剩余位移已不可见时收尾
      if (Math.abs(y) < 0.15 && Math.abs(vel) < 3) {
        y = 0
        vel = 0
        apply()
        raf = 0
        prevTs = 0
        return
      }
      apply()
      raf = requestAnimationFrame(step)
    }

    /* 新文字挂载时被调用：同步抵消这次布局瞬移，再弹簧滑到新位置 */
    const sync = () => {
      const top = naturalTop()
      const delta = top - last
      last = top
      if (Math.abs(delta) < 0.5) return
      if (document.documentElement.getAttribute('data-static') === '1') return
      y -= delta
      vel = 0
      prevTs = 0
      apply()
      if (!raf) raf = requestAnimationFrame(step)
    }

    if (shiftApi) shiftApi.current = sync

    // 窗口尺寸变化只更新基线，不播动画
    const onResize = () => {
      last = naturalTop()
    }
    window.addEventListener('resize', onResize)

    // 字体加载完成后副标题高度可能变一次，同步刷新基线（避免下次补位算错）
    let alive = true
    document.fonts?.ready?.then(() => {
      if (alive) last = naturalTop()
    })

    return () => {
      alive = false
      window.removeEventListener('resize', onResize)
      if (shiftApi) shiftApi.current = null
      if (raf) cancelAnimationFrame(raf)
      el.style.transform = ''
    }
  }, [shiftApi])

  useEffect(() => {
    firstRef.current = false
  }, [])

  // 测量文案宽度 → 按钮宽度平滑过渡
  useLayoutEffect(() => {
    const m = measureRef.current
    const pill = pillRef.current
    if (!m || !pill) return
    const cs = getComputedStyle(pill)
    const pl = parseFloat(cs.paddingLeft) || 0
    const pr = parseFloat(cs.paddingRight) || 0
    setBtnW(m.offsetWidth + pl + pr)
  }, [lang, pillRef])

  return (
    <div ref={shiftRef} className="mt-8">
      <div ref={wrapRef} className="pointer-events-none">
        <motion.button
        ref={pillRef}
        type="button"
        className="glass-pill cta-btn pointer-events-auto relative"
        initial={staticMode ? false : { opacity: 0 }}
        animate={{ opacity: 1, width: btnW ?? 'auto' }}
        transition={{
          opacity: { duration: 0.6, delay: firstRef.current ? 0.8 : 0 },
          width: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }
        }}
      >
        {/* 隐藏测量层：读取当前文案宽度 */}
        <span
          ref={measureRef}
          className="pointer-events-none absolute left-0 top-0 whitespace-nowrap opacity-0"
          aria-hidden="true"
        >
          {t('landing.cta')}
        </span>

        <AnimatePresence mode="wait">
          <motion.span
            key={lang}
            {...SWITCH_ANIM}
            exit={SWITCH_EXIT}
            initial={staticMode ? false : SWITCH_ANIM.initial}
            transition={{
              duration: 0.17,
              ease: 'easeOut',
              delay: firstRef.current ? 0.8 : 0.08
            }}
            className="relative z-[1]"
          >
            {t('landing.cta')}
          </motion.span>
        </AnimatePresence>
        </motion.button>
      </div>
    </div>
  )
}

export default function Landing() {
  const { t, lang, staticMode } = useApp()
  const firstRef = useRef(true)
  /* 按钮补位动画的触发器：新副标题挂载时调用 */
  const shiftApi = useRef(null)

  useEffect(() => {
    firstRef.current = false
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col">
      <motion.header
        className="flex items-center justify-between px-6 py-5 md:px-10"
        initial={staticMode ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <span className="text-sm font-medium tracking-wide">
            <span style={{ color: 'var(--c-text)' }}>ZHBO</span>
            <span style={{ color: 'var(--c-cyan)' }}>Wiki</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ContactPill />
          <LangSwitch />
        </div>
      </motion.header>

      {/* 标题区：大标题精确垂直居中，与开场动画标题逐像素一致 */}
      <div className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center">
        <h1
          className="flex flex-wrap items-baseline justify-center px-6 font-display text-[clamp(46px,9.5vw,104px)] font-black leading-none tracking-[0.04em]"
          style={{ transform: 'translateY(var(--title-shift))' }}
        >
          {TITLE.map((char, i) => (
            <span
              key={`${char}-${i}`}
              style={{
                textShadow: '0 0 28px rgba(34,211,238,0.28)',
                color: i < 4 ? 'var(--c-text)' : 'var(--c-cyan)'
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* 标题下方内容：副标题 + 胶囊按钮，绝对定位不参与居中 */}
        <div
          className="absolute inset-x-0 flex flex-col items-center"
          style={{
            top: '50%',
            marginTop:
              'calc(clamp(46px, 9.5vw, 104px) / 2 + 28px + var(--title-shift))'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={lang}
              className="max-w-md text-center text-sm leading-relaxed"
              style={{ color: 'var(--c-muted)' }}
              {...SWITCH_ANIM}
              exit={SWITCH_EXIT}
              initial={staticMode ? false : SWITCH_ANIM.initial}
              transition={{
                duration: 0.17,
                ease: 'easeOut',
                delay: firstRef.current ? 0.55 : 0
              }}
            >
              {t('landing.sub')}
              {/* 新文字挂载即触发按钮补位（同一帧内同步处理，不闪） */}
              <ShiftProbe onMount={() => shiftApi.current?.()} />
            </motion.p>
          </AnimatePresence>

          <CtaButton staticMode={staticMode} shiftApi={shiftApi} />
        </div>
      </div>

      {/* 占位，撑起页面高度 */}
      <main className="flex-1" />

      <motion.footer
        className="px-6 py-6 text-center text-[11px] tracking-wide"
        style={{ color: 'var(--c-muted)' }}
        initial={staticMode ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        © {new Date().getFullYear()} ZHBOWiki
      </motion.footer>
    </div>
  )
}
