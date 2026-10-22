import { useEffect, useRef } from 'react'

/* 玻璃胶囊交互：朝鼠标吸附 + 边缘高光跟随（写入 --mx/--my 供 ::before 使用） */
export function useGlassHover(maxPull = 5) {
  const wrapRef = useRef(null)
  const pillRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const pill = pillRef.current
    if (!wrap || !pill) return

    let raf = 0
    let mx = -9999
    let my = -9999
    let tx = 0
    let ty = 0
    let targetX = 0
    let targetY = 0

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
    }

    const tick = () => {
      if (document.documentElement.getAttribute('data-static') !== '1') {
        const rect = pill.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2

        // 吸附：朝鼠标方向偏移
        const adx = mx - cx
        const ady = my - cy
        const adist = Math.hypot(adx, ady)
        if (adist < Math.max(rect.width, rect.height) / 2 + 10) {
          targetX = (adx / (adist || 1)) * maxPull
          targetY = (ady / (adist || 1)) * maxPull
        } else {
          targetX = 0
          targetY = 0
        }
        tx += (targetX - tx) * 0.18
        ty += (targetY - ty) * 0.18
        // maxPull 为 0 时不位移（只要边缘高光跟随）
        if (maxPull > 0) {
          wrap.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`
        }

        // 边缘高光位置跟随鼠标
        const mxPct = ((mx - rect.left) / rect.width) * 100
        const myPct = ((my - rect.top) / rect.height) * 100
        pill.style.setProperty('--mx', `${mxPct.toFixed(1)}%`)
        pill.style.setProperty('--my', `${myPct.toFixed(1)}%`)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [maxPull])

  return { wrapRef, pillRef }
}
