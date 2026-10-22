import { motion } from 'framer-motion'

export default function Logo({ size = 36, glow = true }) {
  return (
    <div className="relative flex items-center justify-center">
      {glow && (
        <div
          className="absolute inset-0 rounded-xl blur-md"
          style={{ background: 'rgba(0,240,255,0.35)' }}
        />
      )}
      <motion.div
        className="relative flex items-center justify-center rounded-xl border border-neon/40 bg-[#071018]"
        style={{
          width: size,
          height: size,
          boxShadow: '0 0 22px rgba(0,240,255,0.35), inset 0 0 18px rgba(0,240,255,0.12)'
        }}
        whileHover={{ rotate: -6, scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      >
        <span
          className="font-display font-black leading-none"
          style={{
            fontSize: size * 0.52,
            color: '#00f0ff',
            textShadow: '0 0 12px rgba(0,240,255,0.8)'
          }}
        >
          Z
        </span>
      </motion.div>
    </div>
  )
}
