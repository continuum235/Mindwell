'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AnimatedBackdrop from '@/components/layout/animated-backdrop'
import { containerVariants, gridVariants, itemVariants } from '@/lib/animations'
import { fetchJson } from '@/lib/fetcher'
import type { HomeSnapshot } from '@/types/app'

const fallbackSnapshot: HomeSnapshot = {
  careStreak: '6 days',
  breathwork: '5 minutes',
  recentNote: 'Apr 10',
  latestJournal: {
    date: 'April 10, 2026',
    note: 'I felt the tension in my shoulders, and I let myself breathe into it for a few moments.',
  },
  suggestedResource: {
    title: 'Shoulder release in soft light',
    type: 'Somatic',
    duration: '8 min',
    image:
      'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=1200&auto=format&fit=crop',
  },
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [snapshot, setSnapshot] = useState(fallbackSnapshot)

  useEffect(() => {
    let active = true

    async function load() {
      const [data] = await Promise.all([
        fetchJson<HomeSnapshot>('/api/home').catch(() => fallbackSnapshot),
        new Promise((resolve) => window.setTimeout(resolve, 900)),
      ])

      if (!active) {
        return
      }

      setSnapshot(data)
      setIsLoading(false)
    }

    load()

    return () => {
      active = false
    }
  }, [])

  if (isLoading) {
    return (
      <section className="page home-page">
        <AnimatedBackdrop />
        <div className="container" aria-busy="true" aria-live="polite">
          <div className="hero-banner">
            <div className="skeleton-stack">
              <div className="skeleton skeleton-eyebrow" />
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-line skeleton-medium" />
              <div className="skeleton skeleton-line" />
              <div className="hero-actions">
                <div className="skeleton skeleton-button" />
                <div className="skeleton skeleton-button skeleton-button-outline" />
              </div>
            </div>
            <div className="hero-card">
              <div className="skeleton skeleton-eyebrow" />
              <div className="hero-stats">
                <div className="stat">
                  <span className="skeleton skeleton-line skeleton-medium" />
                  <span className="skeleton skeleton-line skeleton-short" />
                </div>
                <div className="stat">
                  <span className="skeleton skeleton-line skeleton-medium" />
                  <span className="skeleton skeleton-line skeleton-short" />
                </div>
                <div className="stat">
                  <span className="skeleton skeleton-line skeleton-medium" />
                  <span className="skeleton skeleton-line skeleton-short" />
                </div>
              </div>
            </div>
          </div>
          <div className="home-grid">
            <article className="card card-primary">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-medium" />
              <div className="chip-row">
                <span className="skeleton skeleton-chip" />
                <span className="skeleton skeleton-chip" />
                <span className="skeleton skeleton-chip" />
                <span className="skeleton skeleton-chip" />
              </div>
              <div className="skeleton skeleton-link" />
            </article>
            <article className="card">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-medium" />
              <div className="skeleton skeleton-eyebrow" />
              <div className="skeleton skeleton-link" />
            </article>
            <article className="card">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-image" />
              <div className="chip-row">
                <span className="skeleton skeleton-chip" />
                <span className="skeleton skeleton-chip" />
                <span className="skeleton skeleton-chip" />
              </div>
              <div className="skeleton skeleton-link" />
            </article>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="page home-page">
      <AnimatedBackdrop />
      <motion.div className="container" variants={containerVariants} initial="hidden" animate="show">
        <motion.div className="hero-banner" variants={itemVariants}>
          <div>
            <p className="eyebrow">Daily grounding</p>
            <h1>Welcome back to your space.</h1>
            <p className="hero-quote">&quot;You are allowed to move slowly, even here.&quot;</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/mood">
                Log today&apos;s mood
              </Link>
              <Link className="btn btn-outline" href="/journal">
                Open your journal
              </Link>
            </div>
          </div>
          <div className="hero-card">
            <p className="eyebrow">Gentle rhythms</p>
            <div className="hero-stats">
              <div className="stat">
                <span>Care streak</span>
                <strong>{snapshot.careStreak}</strong>
              </div>
              <div className="stat">
                <span>Breathwork</span>
                <strong>{snapshot.breathwork}</strong>
              </div>
              <div className="stat">
                <span>Recent note</span>
                <strong>{snapshot.recentNote}</strong>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div className="home-grid" variants={gridVariants}>
          <motion.article className="card card-primary" variants={itemVariants}>
            <h2>Log today&apos;s mood</h2>
            <p>
              A soft check-in to notice how your body feels right now. No judgment, just truth.
            </p>
            <div className="chip-row">
              <span className="chip">Grounded</span>
              <span className="chip">Tender</span>
              <span className="chip">Restless</span>
              <span className="chip">Open</span>
            </div>
            <Link className="text-link" href="/mood">
              Open mood tracker
            </Link>
          </motion.article>
          <motion.article className="card" variants={itemVariants}>
            <h2>Most recent journal</h2>
            <p>{`"${snapshot.latestJournal.note}"`}</p>
            <p className="eyebrow">{snapshot.latestJournal.date}</p>
            <Link className="text-link" href="/journal">
              Return to this entry
            </Link>
          </motion.article>
          <motion.article className="card" variants={itemVariants}>
            <h2>Suggested resource</h2>
            <p>
              <motion.img
                src={snapshot.suggestedResource.image}
                alt="Soft botanical light in a calm interior"
                className="h-48 w-full object-cover rounded-md"
                initial={{ filter: 'blur(10px)', opacity: 0 }}
                animate={{ filter: 'blur(0px)', opacity: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </p>
            <div className="chip-row">
              <span className="chip">{snapshot.suggestedResource.type}</span>
              <span className="chip">Audio</span>
              <span className="chip">10 min</span>
            </div>
            <Link className="text-link" href="/stress">
              Browse the library
            </Link>
          </motion.article>
        </motion.div>
      </motion.div>
    </section>
  )
}
