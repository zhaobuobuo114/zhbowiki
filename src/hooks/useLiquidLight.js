import { useEffect, useRef } from 'react'

/* 液态玻璃光源：与背景鼠标光源同一套参数与手感
   - 半径 150px，0.9px/ms 满亮，静止 0.6s 后衰减
   - 起亮每帧 12%，消失 5%
   - 输出 CSS 变量：--mx/--my（光源位置）、--glow（总亮度）、
     --e-top/right/bottom/left（各边反光强度）、--ex/--ey（边缘光带中心）
   组件内需自行放置四条 .liquid-edge 光带，并声明 --glow / --e-* 默认值 */
export function useLiquidLight(
  ref,
  { enabled = true, radius = 150, fullSpeed = 0.9, idleMs = 600, entryBoost = 0 } = {}
) {
  const st = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    a: 0,
    targetA: 0,
    lastMove: 0,
    lastT: 0,
    inside: false,
    raf: 0
  })

  useEffect(() => {
    const s = st.current
    return () => {
      if (s.raf) cancelAnimationFrame(s.raf)
      s.raf = 0
    }
  }, [])

  const zero = (el) => {
    el.style.setProperty('--glow', '0')
    el.style.setProperty('--e-top', '0')
    el.style.setProperty('--e-right', '0')
    el.style.setProperty('--e-bottom', '0')
    el.style.setProperty('--e-left', '0')
  }

  const startLoop = () => {
    const s = st.current
    if (s.raf) return

    const tick = () => {
      const el = ref.current
      if (!el) {
        s.raf = 0
        return
      }

      // 光源位置缓动，形成跟随的“光线追踪”尾迹
      s.x += (s.tx - s.x) * 0.14
      s.y += (s.ty - s.y) * 0.14

      const now = performance.now()
      if (now - s.lastMove > idleMs) s.targetA *= 0.9
      const k = s.targetA > s.a ? 0.12 : 0.05
      s.a += (s.targetA - s.a) * k

      const rect = el.getBoundingClientRect()
      if (rect.width && rect.height) {
        const px = s.x - rect.left
        const py = s.y - rect.top
        const prox = (d) => Math.max(0, Math.min(1, 1 - d / radius))
        const eTop = prox(py) * s.a
        const eBottom = prox(rect.height - py) * s.a
        const eLeft = prox(px) * s.a
        const eRight = prox(rect.width - px) * s.a

        el.style.setProperty('--mx', `${((px / rect.width) * 100).toFixed(2)}%`)
        el.style.setProperty('--my', `${((py / rect.height) * 100).toFixed(2)}%`)
        el.style.setProperty('--ex', `${((px / rect.width) * 100).toFixed(2)}%`)
        el.style.setProperty('--ey', `${((py / rect.height) * 100).toFixed(2)}%`)
        el.style.setProperty('--glow', s.a.toFixed(3))
        el.style.setProperty('--e-top', eTop.toFixed(3))
        el.style.setProperty('--e-right', eRight.toFixed(3))
        el.style.setProperty('--e-bottom', eBottom.toFixed(3))
        el.style.setProperty('--e-left', eLeft.toFixed(3))
      }

      if (s.a < 0.004 && s.targetA < 0.004) {
        s.a = 0
        s.targetA = 0
        zero(el)
        s.raf = 0
        return
      }
      s.raf = requestAnimationFrame(tick)
    }

    s.raf = requestAnimationFrame(tick)
  }

  const onPointerEnter = (e) => {
    if (!enabled || e.pointerType !== 'mouse') return
    const s = st.current
    const now = performance.now()
    s.inside = true
    s.x = e.clientX
    s.y = e.clientY
    s.tx = e.clientX
    s.ty = e.clientY
    s.lastT = now
    s.lastMove = now

    /* 小尺寸目标（如 40px 按钮）进入时给一个初始亮度，
       否则指针一进来就停住，速度采样为 0，看起来像没有效果 */
    if (entryBoost > 0) {
      s.targetA = entryBoost
      startLoop()
    }
  }

  const onPointerMove = (e) => {
    if (!enabled || e.pointerType !== 'mouse') return
    const s = st.current
    const now = performance.now()
    if (!s.inside) onPointerEnter(e)

    const dt = Math.max(1, now - s.lastT)
    const dist = Math.hypot(e.clientX - s.tx, e.clientY - s.ty)
    // 抖动小于 0.5px 时保留进入亮度，避免首帧被 0 覆盖
    if (dist > 0.5) s.targetA = Math.min(1, dist / dt / fullSpeed)
    s.tx = e.clientX
    s.ty = e.clientY
    s.lastT = now
    s.lastMove = now
    startLoop()
  }

  const onPointerLeave = () => {
    if (!enabled) return
    const s = st.current
    s.inside = false
    s.targetA = 0
    startLoop()
  }

  return { onPointerEnter, onPointerMove, onPointerLeave }
}
