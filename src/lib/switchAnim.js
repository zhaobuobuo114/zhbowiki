/* 语言切换时的文字动画参数（副标题与「联系我们」共用，保证手感一致）
   进场：模糊 8px + 下移 4px → 清晰归位
   退场：模糊 8px + 上移 4px */
export const SWITCH_ANIM = {
  initial: { opacity: 0, y: 4, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -4, filter: 'blur(8px)' }
}

/* 退场单独设定时长：避免继承入场的首次延迟 */
export const SWITCH_EXIT = {
  ...SWITCH_ANIM.exit,
  transition: { duration: 0.17, ease: 'easeOut', delay: 0 }
}

/* 单程时长（先出后进，合计约 0.34s） */
export const SWITCH_DURATION = 0.17
