'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import AnimatedBackdrop from '@/components/layout/animated-backdrop'
import { containerVariants, gridVariants, itemVariants } from '@/lib/animations'
import { formatLongDate } from '@/lib/date'
import { fetchJson } from '@/lib/fetcher'
import type { JournalEntry } from '@/types/app'

const fallbackEntries: JournalEntry[] = [
  {
    date: 'April 10, 2026',
    note: 'Let myself slow down and rest my palms on my chest.',
  },
  {
    date: 'April 08, 2026',
    note: 'Noticed the morning light and breathed with it.',
  },
  {
    date: 'April 05, 2026',
    note: 'Wrote a small list of what feels safe today.',
  },
]

export default function JournalPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [entries, setEntries] = useState<JournalEntry[]>(fallbackEntries)
  const [note, setNote] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      const [data] = await Promise.all([
        fetchJson<JournalEntry[]>('/api/journal').catch(() => fallbackEntries),
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

  async function handleSaveEntry() {
    const trimmed = note.trim()

    if (!trimmed) {
      return
    }

    const data = await fetchJson<JournalEntry[]>('/api/journal', {
      method: 'POST',
      body: JSON.stringify({ note: trimmed }),
    })

    setEntries(data)
    setNote('')
  }

  if (isLoading) {
    return (
      <section className="page">
        <AnimatedBackdrop />
        <div className="container" aria-busy="true" aria-live="polite">
          <div className="skeleton skeleton-eyebrow" />
          <div className="skeleton skeleton-title" />
          <div className="journal-layout">
            <div className="journal-shell">
              <div className="journal-ui">
                <div className="skeleton-stack">
                  <div className="skeleton skeleton-title" />
                  <div className="skeleton skeleton-eyebrow" />
                </div>
                <div className="skeleton skeleton-button skeleton-button-outline" />
              </div>
              <div className="skeleton skeleton-textarea" />
            </div>
            <aside className="journal-sidebar">
              <div className="skeleton skeleton-eyebrow" />
              {Array.from({ length: 3 }, (_, index) => (
                <div className="entry-item" key={`entry-skeleton-${index}`}>
                  <div className="skeleton skeleton-line skeleton-medium" />
                  <div className="skeleton skeleton-line" />
                </div>
              ))}
            </aside>
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
          The journal
        </motion.p>
        <motion.h1 variants={itemVariants}>Your quiet notebook.</motion.h1>
        <motion.div className="journal-layout" variants={gridVariants}>
          <motion.div className="journal-shell" variants={itemVariants}>
            <div className="journal-ui">
              <div>
                <h2>Today&apos;s entry</h2>
                <p className="eyebrow">{formatLongDate(new Date())}</p>
              </div>
              <button className="btn btn-outline" type="button" onClick={handleSaveEntry}>
                Save entry
              </button>
            </div>
            <textarea
              className="journal-textarea"
              placeholder="Let the page hold what you are carrying..."
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </motion.div>
          <motion.aside className="journal-sidebar" variants={itemVariants}>
            <p className="eyebrow">Past entries</p>
            {entries.map((entry) => (
              <div className="entry-item" key={`${entry.date}-${entry.note}`}>
                <strong>{entry.date}</strong>
                <p>{entry.note}</p>
              </div>
            ))}
          </motion.aside>
        </motion.div>
      </motion.div>
    </section>
  )
}
