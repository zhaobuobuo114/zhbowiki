import { useEffect, useRef, useState } from 'react'

/* ================= 网格方块 + 斜向拱形波 =================
   背景由 56px 的方块网格构成，每个方块是独立像素块。
   单道 45° 斜向波纹带（左上↔右下）从左往右沿对角线推进，
   波峰经过处方块被逐块顶起（6–12px，带轻微阴影/暗面），
   格子之间露出黑色裂缝，波峰两侧平滑回落。
   用 Canvas 逐帧绘制，性能好、精确可控。 */

const CELL = 56 // 方块粒度
const WAVE_PERIOD = 7000 // 扫过一遍 7s
const WAVE_MAX_LIFT = 11 // 波峰最高顶起 px（轻柔）
const WAVE_HALF_WIDTH = 140 // 波峰带半宽（斜向）

/* 45° 斜向坐标：把 (x,y) 投影到对角方向 u = (x+y)/√2 */
const diag = (x, y) => (x + y) / Math.SQRT2

/* 平滑拱形剖面：-1..1 之间，中心 1、两侧 0（余弦平滑） */
const arch = (u, center, halfWidth) => {
  const d = (u - center) / halfWidth
  if (Math.abs(d) >= 1) return 0
  return (Math.cos(Math.PI * d) + 1) / 2
}

/* 读取当前主题的 CSS 变量颜色（返回 {r,g,b} 整数） */
function readThemeColors() {
  const cs = getComputedStyle(document.documentElement)
  const parse = (v) => {
    const m = v.trim().match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
    if (m) return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
    return { r: 10, g: 14, b: 20 }
  }
  const bg = parse(cs.getPropertyValue('--c-bg').trim())
  const soft = parse(cs.getPropertyValue('--c-bg-soft').trim())
  return { bg, soft }
}

/* 网格方块层：Canvas 绘制，方块被斜向波逐块顶起 */
function GridBlocksLayer() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf = 0
    let start = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (ts) => {
      if (!start) start = ts
      const elapsed = (ts - start) % WAVE_PERIOD
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)

      const { soft } = readThemeColors()

      // 波峰斜向中心沿对角线推进
      const t = elapsed / WAVE_PERIOD
      const centerU = -WAVE_HALF_WIDTH + t * (diag(w, h) + WAVE_HALF_WIDTH * 2)

      // 逐格绘制方块
      const cols = Math.ceil(w / CELL) + 1
      const rows = Math.ceil(h / CELL) + 1

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const px = cx * CELL
          const py = cy * CELL
          const u = diag(px + CELL / 2, py + CELL / 2)
          const k = arch(u, centerU, WAVE_HALF_WIDTH) // 0..1
          const lift = k * WAVE_MAX_LIFT

          const baseBoost = 7
          const brighten = baseBoost + lift * 1.6
          const topR = Math.min(255, soft.r + brighten)
          const topG = Math.min(255, soft.g + brighten)
          const topB = Math.min(255, soft.b + brighten)

          const gap = 1.5 + k * 2.5
          const bx = px + gap / 2
          const by = py - lift + gap / 2
          const bs = CELL - gap
          if (bs <= 0) continue

          const shade = k * 0.28

          ctx.fillStyle = `rgb(${topR},${topG},${topB})`
          ctx.fillRect(bx, by, bs, bs)

          if (k > 0.02) {
            ctx.fillStyle = `rgba(0,0,0,${shade})`
            ctx.fillRect(bx + bs - 2, by, 2, bs)
            ctx.fillRect(bx, by + bs - 2, bs, 2)
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="grid-blocks absolute inset-0 h-full w-full"
    />
  )
}

/* ---------- 隐藏元素层：官方纹理 + 头像 ---------- */
const ICON_WAVE_AMPLITUDE = 22 // 图标随波起伏的振幅

/* 隐藏元素基础数据（left/top 由随机布局生成）
   BASE_URL 兼容本地根路径部署与 GitHub Pages 子路径部署 */
const ASSET = (name) => `${import.meta.env.BASE_URL}assets/${name}`

const BASE_ITEMS = [
  { key: 'portrait', src: ASSET('portrait.jpg'), size: 190, rotate: -8 },
  { key: 'creeper', src: ASSET('mc-creeper.png'), size: 150, rotate: 10 },
  { key: 'grass', src: ASSET('mc-grass.png'), size: 130, rotate: -6 },
  { key: 'diamond', src: ASSET('mc-diamond.png'), size: 110, rotate: 12 },
  { key: 'tnt', src: ASSET('mc-tnt.png'), size: 120, rotate: -10 }
]

/* 每次启动随机生成位置：避开中央标题区 + 右上按钮区，图标间不重叠 */
function randomLayout() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const placed = []
  return BASE_ITEMS.map((item) => {
    const r = item.size / 2
    let left = 0
    let top = 0
    let ok = false
    for (let attempt = 0; attempt < 90 && !ok; attempt++) {
      left = 6 + Math.random() * 88
      top = 6 + Math.random() * 88
      const cx = (left / 100) * vw
      const cy = (top / 100) * vh
      // 避开中央标题区
      if (cx > vw * 0.27 && cx < vw * 0.73 && cy > vh * 0.37 && cy < vh * 0.63) continue
      // 避开右上按钮区
      if (cx > vw * 0.8 && cy < vh * 0.16) continue
      // 图标间不重叠（最小间距 24px）
      const overlap = placed.some((p) => Math.hypot(cx - p.x, cy - p.y) < r + p.r + 24)
      if (overlap) continue
      ok = true
    }
    placed.push({ x: (left / 100) * vw, y: (top / 100) * vh, r })
    return { ...item, left: `${left.toFixed(1)}%`, top: `${top.toFixed(1)}%` }
  })
}

function useRandomLayout() {
  const [items, setItems] = useState(() => randomLayout())
  useEffect(() => {
    const onResize = () => setItems(randomLayout())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return items
}

function HiddenLayer({ items }) {
  return (
    <div className="hidden-layer absolute inset-0">
      {items.map((item) => (
        <div
          key={item.key}
          data-icon="1"
          className="absolute"
          style={{
            left: item.left,
            top: item.top,
            width: item.size,
            height: item.size
          }}
        >
          {/* 跳/放大位移层：屏幕坐标，跟随鼠标偏移 + 轻微放大 + 荧光 */}
          <div data-jump="1" className="h-full w-full">
            {/* 居中锚点 + 静态旋转 */}
            <div
              className="h-full w-full"
              style={{ transform: `translate(-50%, -50%) rotate(${item.rotate}deg)` }}
            >
              {/* 波形位移容器：移到 mask 外层，让 mask 与图片一起随波移动，避免图片被 mask 裁剪 */}
              <div data-wave="1" className="h-full w-full" style={{ willChange: 'transform' }}>
                {/* 边缘渐隐 mask：更宽更柔 */}
                <div
                  className="h-full w-full"
                  style={{
                    WebkitMaskImage:
                      'radial-gradient(circle closest-side at 50% 50%, #000 40%, rgba(0,0,0,0.6) 68%, rgba(0,0,0,0.2) 88%, transparent 100%)',
                    maskImage:
                      'radial-gradient(circle closest-side at 50% 50%, #000 40%, rgba(0,0,0,0.6) 68%, rgba(0,0,0,0.2) 88%, transparent 100%)'
                  }}
                >
                  <img
                    src={item.src}
                    alt=""
                    data-portrait={item.key === 'portrait' ? '1' : '0'}
                    className="hidden-item h-full w-full object-cover"
                    style={
                      item.key === 'portrait'
                        ? undefined
                        : { imageRendering: 'pixelated' }
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------- 鼠标光源：亮度随移动速度变化，静止后淡出 ---------- */
const LIGHT_R = 150 // 光斑半径（与 CSS --light-r 一致）
const LIGHT_FULL_SPEED = 0.9 // 满亮度所需速度（px/ms）
const HOVER_JUMP = 6 // 跟随偏移 px
const HOVER_SCALE = 0.1 // 放大增量（1 → 1.1）
const WAVE_REVEAL_FADE_MS = 800 // 波峰离开后淡出时长（0.8s）
const GLOW_ALPHA = 0.6 // 荧光透明度（内层亮光晕）

function useMouseLight(ref, light) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let targetX = tx
    let targetY = ty
    let speed = 0
    let lastMove = performance.now()
    let raf = 0

    const onMove = (e) => {
      const now = performance.now()
      const dt = Math.max(1, now - lastMove)
      const dx = e.clientX - targetX
      const dy = e.clientY - targetY
      speed = Math.hypot(dx, dy) / dt
      targetX = e.clientX
      targetY = e.clientY
      lastMove = now
    }

    const tick = (now) => {
      // 位置柔和缓动
      tx += (targetX - tx) * 0.14
      ty += (targetY - ty) * 0.14

      // 静止 0.6s 后速度衰减
      const idle = now - lastMove
      if (idle > 600) speed *= 0.9
      const targetA = Math.min(1, speed / LIGHT_FULL_SPEED)
      // 显现快、消失慢
      const k = targetA > light.current.a ? 0.12 : 0.05
      light.current.a += (targetA - light.current.a) * k

      light.current.x = tx
      light.current.y = ty

      el.style.setProperty('--lx', `${tx}px`)
      el.style.setProperty('--ly', `${ty}px`)
      el.style.setProperty('--light-a', light.current.a.toFixed(3))

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [ref, light])
}

/* 图标交互：光斑/波浪显现（整图）+ 悬停跟随/放大 + 荧光随强度 */
function useIconInteractions(ref, light) {
  useEffect(() => {
    const root = ref.current
    if (!root) return

    let icons = []
    let raf = 0
    let start = 0
    let lastNow = 0
    let mx = -9999
    let my = -9999

    const measure = () => {
      icons = Array.from(root.querySelectorAll('[data-icon]')).map((el) => {
        const jump = el.querySelector('[data-jump]')
        const wave = el.querySelector('[data-wave]')
        const img = el.querySelector('img')
        const rect = el.getBoundingClientRect()
        return {
          el,
          jump,
          wave,
          img,
          // 图标视觉中心：translate(-50%,-50%) 后，图标中心落在锚点左上角 (left, top)
          cx: rect.left,
          cy: rect.top,
          u: diag(rect.left, rect.top),
          r: rect.width / 2 + 12, // 判定半径 = 图标半径 + 12px 余量
          hover: 0,
          waveReveal: 0, // 波浪显现强度（含 0.8s 衰减）
          isPortrait: img.dataset.portrait === '1'
        }
      })
    }
    const t1 = setTimeout(measure, 180)
    window.addEventListener('resize', measure)

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
    }

    const tick = (now) => {
      if (!start) start = now
      const dt = lastNow ? now - lastNow : 16
      lastNow = now

      const isStatic = document.documentElement.getAttribute('data-static') === '1'
      const elapsed = (now - start) % WAVE_PERIOD
      const w = window.innerWidth
      const h = window.innerHeight
      const t = elapsed / WAVE_PERIOD
      const centerU = -WAVE_HALF_WIDTH + t * (diag(w, h) + WAVE_HALF_WIDTH * 2)

      icons.forEach((it) => {
        if (isStatic) {
          it.el.style.opacity = '0.7'
          it.jump.style.transform = 'translate(0px, 0px) scale(1)'
          it.jump.style.filter = 'none'
          it.wave.style.transform = 'translateY(0px)'
          return
        }

        // 波位移（合并到这里，保证判定中心与图标实际位置一致）
        const lift = -ICON_WAVE_AMPLITUDE * arch(it.u, centerU, WAVE_HALF_WIDTH)
        it.wave.style.transform = `translateY(${lift.toFixed(2)}px)`
        // 图标视觉中心 = 锚点中心 + 波位移
        const vcx = it.cx
        const vcy = it.cy + lift

        // 波峰强度（0~1）：波浪浮出，上升快速跟随、离开后 0.8s 缓降
        const waveIntensity = arch(it.u, centerU, WAVE_HALF_WIDTH)
        if (waveIntensity > it.waveReveal) {
          it.waveReveal = waveIntensity
        } else {
          it.waveReveal = Math.max(0, it.waveReveal - dt / WAVE_REVEAL_FADE_MS)
        }

        // 光斑显现强度：光斑照到图标中心 → 整图显现，强度 = 光斑亮度
        const dLight = Math.hypot(light.current.x - vcx, light.current.y - vcy)
        const rLight = dLight < LIGHT_R ? light.current.a : 0

        // 最终显现 = max(光斑, 波浪)
        const reveal = Math.max(rLight, it.waveReveal)
        it.el.style.opacity = reveal.toFixed(3)

        // 悬停（跟随 + 放大）
        const dx = mx - vcx
        const dy = my - vcy
        const dist = Math.hypot(dx, dy)
        const targetHover = dist < it.r ? 1 : 0
        it.hover += (targetHover - it.hover) * 0.18

        // 强度 = max(悬停, 波浪显现)，驱动提亮与荧光
        const intensity = Math.max(it.hover, it.waveReveal)

        // 跟随 + 放大（仅 hover）
        if (it.hover > 0.01) {
          const nx = dx / (dist || 1)
          const ny = dy / (dist || 1)
          const off = it.hover * HOVER_JUMP
          const sc = 1 + it.hover * HOVER_SCALE
          it.jump.style.transform = `translate(${(nx * off).toFixed(1)}px, ${(ny * off).toFixed(1)}px) scale(${sc.toFixed(3)})`
        } else {
          it.jump.style.transform = 'translate(0px, 0px) scale(1)'
        }

        // 提亮：hover 或波浪浮出都随强度提升图片本身亮度（头像不提亮）
        if (!it.isPortrait) {
          if (intensity > 0.01) {
            const b = (0.38 + intensity * 0.32).toFixed(2)
            const s = (0.7 + intensity * 0.2).toFixed(2)
            it.img.style.filter = `brightness(${b}) saturate(${s})`
          } else {
            it.img.style.filter = ''
          }
        }

        // 荧光 = 随强度变化（双层光晕，内亮外柔）
        if (intensity > 0.01) {
          const a = (GLOW_ALPHA * intensity).toFixed(3)
          const a2 = (GLOW_ALPHA * intensity * 0.65).toFixed(3)
          it.jump.style.filter = `drop-shadow(0 0 9px rgba(34,211,238,${a})) drop-shadow(0 0 30px rgba(34,211,238,${a2}))`
        } else {
          it.jump.style.filter = 'none'
        }
      })

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t1)
      window.removeEventListener('resize', measure)
      window.removeEventListener('mousemove', onMove)
    }
  }, [ref, light])
}

export default function BackgroundFX({ staticMode = false }) {
  const rootRef = useRef(null)
  const light = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, a: 0 })
  const items = useRandomLayout()

  useMouseLight(rootRef, light)
  useIconInteractions(rootRef, light)

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ '--lx': '50vw', '--ly': '50vh', '--light-a': 0 }}
    >
      {/* 底色 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 42%, rgba(34,211,238,0.06), transparent 58%)'
        }}
      />

      {/* 网格方块：被斜向波逐块顶起 */}
      <GridBlocksLayer />

      {/* 海底色调罩 */}
      <div className="underwater-tint absolute inset-0" />

      {/* 隐藏元素：被光源照到点亮，悬停跟随/放大/荧光 */}
      <HiddenLayer items={items} />

      {/* 光源罩：亮度随鼠标速度，移动亮、静止淡出 */}
      <div className="light-source absolute inset-0" />

      {/* 底部渐隐 */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background: 'linear-gradient(to top, var(--c-bg), transparent)'
        }}
      />
    </div>
  )
}
