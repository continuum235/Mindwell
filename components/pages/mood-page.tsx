'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import AnimatedBackdrop from '@/components/layout/animated-backdrop'
import { containerVariants, itemVariants } from '@/lib/animations'
import { fetchJson } from '@/lib/fetcher'
import type { MoodEntry } from '@/types/app'

const moodClasses = ['mood-soft', 'mood-rose', 'mood-sage', 'mood-terracotta', 'mood-mist'] as const

const moodOptions = [
  { label: 'Grounded', tone: 'var(--sage)' },
  { label: 'Tender', tone: 'var(--rose)' },
  { label: 'Restless', tone: 'var(--terracotta)' },
  { label: 'Clear', tone: 'var(--sage)' },
  { label: 'Open', tone: 'var(--rose)' },
]

export default function MoodPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [entries, setEntries] = useState<MoodEntry[]>([])

  useEffect(() => {
    let active = true

    async function load() {
      const [data] = await Promise.all([
        fetchJson<MoodEntry[]>('/api/moods').catch(() => []),
        new Promise((resolve) => window.setTimeout(resolve, 900)),
      ])

      if (!active) {
        return
      }

      setEntries(data)
      setIsLoading(false)
    }

    load()

    return () => {
      active = false
    }
  }, [])

  async function handleSelectMood(label: string) {
    const data = await fetchJson<MoodEntry[]>('/api/moods', {
      method: 'POST',
      body: JSON.stringify({ label }),
    })

    setEntries(data)
  }

  const entryByDay = new Map(entries.map((entry) => [entry.day, entry]))

  if (isLoading) {
    return (
      <section className="page">
        <AnimatedBackdrop />
        <div className="container" aria-busy="true" aria-live="polite">
          <div className="skeleton skeleton-eyebrow" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-medium" />
          <div className="mood-calendar">
            {Array.from({ length: 30 }, (_, index) => (
              <div key={`mood-skeleton-${index}`} className="mood-day skeleton skeleton-day" />
            ))}
          </div>
          <div className="mood-actions">
            <div className="skeleton skeleton-title" />
            <div className="mood-options">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={`mood-pill-${index}`} className="skeleton skeleton-pill" />
              ))}
            </div>
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
          Mood tracker
        </motion.p>
        <motion.h1 variants={itemVariants}>Notice your rhythm.</motion.h1>
        <motion.p variants={itemVariants}>
          A soft calendar of how you have been feeling. Each day holds a watercolor tone instead
          of a score.
        </motion.p>
        <motion.div className="mood-calendar" variants={itemVariants}>
          {Array.from({ length: 30 }, (_, index) => {
            const day = index + 1
            const entry = entryByDay.get(day)

            return (
              <div
                key={`day-${day}`}
                className={`mood-day ${entry?.tone || moodClasses[index % moodClasses.length]}`}
              >
                <span>Day {day}</span>
                <span>{entry ? entry.label.slice(0, 1) : '+'}</span>
              </div>
            )
          })}
        </motion.div>
        <motion.div className="mood-actions" variants={itemVariants}>
          <h2>How are you right now?</h2>
          <div className="mood-options">
            {moodOptions.map((option) => (
              <button
                key={option.label}
                className="mood-pill"
                type="button"
                onClick={() => handleSelectMood(option.label)}
              >
                <span className="mood-dot" style={{ background: option.tone }} />
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
