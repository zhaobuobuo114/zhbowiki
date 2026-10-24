import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../store.jsx'
import { SWITCH_ANIM, SWITCH_EXIT } from '../lib/switchAnim.js'

/* 语言切换文字动画：与首页副标题完全一致（模糊淡出 → 模糊淡入）
   - 用 grid 叠层让新旧文案同时占位，避免退出瞬间高度塌陷导致页面抖动
   - block 用于整块内容（卡片），默认 inline 用于标签、按钮文字 */
export default function LangSwap({ children, className = '', as = 'span', block = false }) {
  const { lang, staticMode } = useApp()
  const Tag = motion[as] || motion.span
  const Outer = block ? 'div' : 'span'

  return (
    <Outer className={`lang-swap${block ? ' lang-swap-block' : ''} ${className}`}>
      <AnimatePresence mode="wait">
        <Tag
          key={lang}
          {...SWITCH_ANIM}
          initial={staticMode ? false : SWITCH_ANIM.initial}
          exit={SWITCH_EXIT}
          transition={{ duration: 0.17, ease: 'easeOut' }}
        >
          {children}
        </Tag>
      </AnimatePresence>
    </Outer>
  )
}
