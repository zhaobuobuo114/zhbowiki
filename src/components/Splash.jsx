import { useEffect, useMemo } from 'react'

const TITLE = 'ZHBOWiki'.split('')
const EASE = [0.34, 1.56, 0.64, 1]

export default function Splash({ onDone }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1.5 + Math.random() * 3,
        delay: Math.random() * 2.4,
        duration: 2.2 + Math.random() * 3.4,
        drift: 6 + Math.random() * 18
      })),
    []
  )

  const offsets = useMemo(
    () =>
      TITLE.map(() => ({
        x: (Math.random() - 0.5) * 760,
        y: (Math.random() - 0.5) * 460,
        rotate: (Math.random() - 0.5) * 240
      })),
    []
  )

  useEffect(() => {
    const timer = setTimeout(onDone, 6300)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div
      className={`${
        new URLSearchParams(window.location.search).has('splashstatic')
          ? 'splash-static'
          : 'splash-shell'
      } fixed inset-0 z-[200] flex items-center justify-center overflow-hidden`}
      style={{ background: '#06080f' }}
    >
      {/* 星点 */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: '#22d3ee',
              boxShadow: '0 0 8px rgba(34,211,238,0.6)',
              animation: `twinkle ${p.duration}s ease-in-out ${p.delay}s infinite, drift ${
                p.duration * 3
              }s ease-in-out ${p.delay}s infinite`
            }}
          />
        ))}
      </div>

      {/* 径向光晕 */}
      <div
        className="splash-glow absolute h-[620px] w-[620px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(34,211,238,0.28) 0%, rgba(34,211,238,0.08) 40%, rgba(34,211,238,0) 70%)',
          filter: 'blur(30px)'
        }}
      />

      {/* 标题精确垂直居中（与首页标题位置逐像素一致） */}
      <h1
        className="relative z-10 flex flex-wrap items-baseline justify-center px-6 font-display text-[clamp(46px,9.5vw,104px)] font-black leading-none tracking-[0.04em] text-white"
        style={{ transform: 'translateY(var(--title-shift))' }}
      >
        {TITLE.map((char, i) => (
          <span
            key={`${char}-${i}`}
            className="splash-letter"
            style={{
              '--x': `${offsets[i].x}px`,
              '--y': `${offsets[i].y}px`,
              '--r': `${offsets[i].rotate}deg`,
              animationDelay: `${0.35 + i * 0.06}s`,
              textShadow: '0 0 28px rgba(34,211,238,0.28)',
              color: i < 4 ? '#e6edf3' : '#22d3ee'
            }}
          >
            {char}
          </span>
        ))}
      </h1>

      {/* slogan + 线：绝对定位在标题正下方，不参与居中 */}
      <div
        className="absolute inset-x-0 z-10 flex flex-col items-center"
        style={{
          top: '50%',
          marginTop:
            'calc(clamp(46px, 9.5vw, 104px) / 2 + 28px + var(--title-shift))'
        }}
      >
        <div className="splash-slogan text-center">
          <p className="text-[15px] tracking-[0.3em] text-white/85 md:text-lg">
            用心做好每一个插件 每一次服务
          </p>
          <p className="mt-3 font-display text-[10px] tracking-[0.42em] text-cyan-300/60 md:text-[11px]">
            EVERY PLUGIN · EVERY SERVICE · DONE WITH CARE
          </p>
        </div>

        <div
          className="splash-line mt-9 h-px w-[240px] md:w-[320px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, #00f0ff 50%, transparent)',
            boxShadow: '0 0 10px rgba(34,211,238,0.45)'
          }}
        />
      </div>

      <button
        type="button"
        onClick={onDone}
        className="absolute bottom-6 right-6 rounded-full border border-cyan-400/20 px-4 py-1.5 font-display text-[10px] tracking-[0.3em] text-cyan-200/50 transition hover:border-cyan-300/50 hover:text-cyan-200"
      >
        SKIP
      </button>
    </div>
  )
}
