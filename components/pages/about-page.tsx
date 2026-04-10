'use client'

import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '@/lib/animations'
import { useMinimumDelay } from '@/hooks/use-minimum-delay'
import AnimatedBackdrop from '@/components/layout/animated-backdrop'

export default function AboutPage() {
  const isLoading = useMinimumDelay()

  if (isLoading) {
    return (
      <section className="page">
        <AnimatedBackdrop />
        <div className="container" aria-busy="true" aria-live="polite">
          <div className="skeleton skeleton-eyebrow" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-medium" />
          <div className="editorial-grid">
            <div className="skeleton-stack">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-medium" />
            </div>
            <div className="editorial-image skeleton skeleton-image" />
          </div>
          <div className="about-block block-sage">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-medium" />
          </div>
          <div className="editorial-grid">
            <div className="editorial-image skeleton skeleton-image" />
            <div className="skeleton-stack">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-medium" />
            </div>
          </div>
          <div className="about-block block-rose">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-medium" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="page">
      <AnimatedBackdrop />
      <motion.div className="container" variants={containerVariants} initial="hidden" animate="show">
        <motion.p className="eyebrow" variants={itemVariants}>
          Our ethos
        </motion.p>
        <motion.h1 variants={itemVariants}>Soft structure for hard days.</motion.h1>
        <motion.p variants={itemVariants}>
          Mindwell is a trauma-informed space that meets you with calm, tenderness, and clarity.
          We believe healing is slow, embodied, and beautifully non-linear.
        </motion.p>
        <motion.div className="editorial-grid" variants={itemVariants}>
          <div>
            <h2>Mission</h2>
            <p>
              We offer rituals for regulation, reflection, and gentle accountability. Every
              feature is built to feel like a soft room with warm light.
            </p>
          </div>
          <div className="editorial-image image-one" aria-hidden="true" />
        </motion.div>
        <motion.div className="about-block block-sage" variants={itemVariants}>
          <h2>Privacy as care</h2>
          <p>
            Your notes, moods, and reflections are yours. We hold data with deep respect and
            never sell your story.
          </p>
        </motion.div>
        <motion.div className="editorial-grid" variants={itemVariants}>
          <div className="editorial-image image-two" aria-hidden="true" />
          <div>
            <h2>Holistic approach</h2>
            <p>
              Mindwell blends somatic practice, mindful breathing, and gentle reflection. The
              goal is not perfection, it is presence.
            </p>
          </div>
        </motion.div>
        <motion.div className="about-block block-rose" variants={itemVariants}>
          <h2>Designed for nervous systems</h2>
          <p>
            Spacious layouts, soft edges, and warm typography keep everything accessible and
            grounded.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
