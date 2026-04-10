'use client'

import { motion } from 'framer-motion'

export default function AnimatedBackdrop() {
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[-1]"
      style={{
        background:
          'radial-gradient(circle at 20% 20%, rgba(140, 154, 139, 0.15), rgba(247, 245, 240, 0) 60%)',
        filter: 'blur(120px)',
        pointerEvents: 'none',
      }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 10, ease: 'easeInOut', repeat: Infinity }}
    />
  )
}
