import { motion } from 'framer-motion'
import { useApp } from '../store.jsx'

export const EASE_OUT = [0.22, 1, 0.36, 1]

export function Reveal({ children, delay = 0, y = 26, className = '' }) {
  const { staticMode } = useApp()
  if (staticMode) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerGroup({ children, className = '', delay = 0 }) {
  const { staticMode } = useApp()
  if (staticMode) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-70px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: delay } }
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }) {
  const { staticMode } = useApp()
  if (staticMode) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } }
      }}
    >
      {children}
    </motion.div>
  )
}
