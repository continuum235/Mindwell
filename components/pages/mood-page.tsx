'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
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

function getTodayDay() {
  return new Date().getDate()
}

export default function MoodPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [customMood, setCustomMood] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const today = getTodayDay()

  useEffect(() => {
    let active = true

    async function load() {
      const [data] = await Promise.all([
        fetchJson<MoodEntry[]>('/api/moods').catch(() => []),
        new Promise((resolve) => window.setTimeout(resolve, 900)),
      ])

      if (!active) return

      setEntries(data)
      setIsLoading(false)
    }

    load()

    return () => {
      active = false
    }
  }, [])

  async function handleSelectMood(label: string) {
    const word = label.trim()
    if (!word || isSaving) return

    setIsSaving(true)
    setSaved(false)
    try {
      const data = await fetchJson<MoodEntry[]>('/api/moods', {
        method: 'POST',
        body: JSON.stringify({ label: word }),
      })
      setEntries(data)
      setSaved(true)
      setCustomMood('')
      window.setTimeout(() => setSaved(false), 2400)
    } finally {
      setIsSaving(false)
    }
  }

  function handleCustomSubmit(event: React.FormEvent) {
    event.preventDefault()
    const word = customMood.trim().split(/\s+/)[0] // only first word
    if (word) void handleSelectMood(word)
  }

  const entryByDay = new Map(entries.map((entry) => [entry.day, entry]))
  const todayEntry = entryByDay.get(today)

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
        <motion.p className="eyebrow" variants={itemVariants}>Mood tracker</motion.p>
        <motion.h1 variants={itemVariants}>Notice your rhythm.</motion.h1>
        <motion.p variants={itemVariants}>
          In one word — how are you today? Choose a preset or type your own. Your word will mark today on the calendar.
        </motion.p>

        {/* Calendar */}
        <motion.div className="mood-calendar" variants={itemVariants}>
          {Array.from({ length: 30 }, (_, index) => {
            const day = index + 1
            const entry = entryByDay.get(day)
            const isToday = day === today

            return (
              <div
                key={`day-${day}`}
                className={[
                  'mood-day',
                  entry?.tone || moodClasses[index % moodClasses.length],
                  entry ? 'tracked' : '',
                  isToday ? 'mood-day-today' : '',
                ].filter(Boolean).join(' ')}
                title={entry ? `Day ${day}: ${entry.label}` : isToday ? 'Today' : `Day ${day}`}
              >
                <span>{isToday ? '✦' : `Day ${day}`}</span>
                <div className="mood-display">
                  <span className="mood-indicator">{entry ? '✓' : isToday ? '·' : '+'}</span>
                  {entry && <span className="mood-emotion">{entry.label}</span>}
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* Today's status */}
        <motion.div className="mood-today-status" variants={itemVariants}>
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.p
                key="saved"
                className="mood-saved-msg"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                ✓ Today marked — Day {today}
              </motion.p>
            ) : todayEntry ? (
              <motion.p key="existing" className="mood-saved-msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Today&apos;s mood: <strong>{todayEntry.label}</strong> — tap a new word to update it.
              </motion.p>
            ) : null}
          </AnimatePresence>
        </motion.div>

        {/* Mood selection */}
        <motion.div className="mood-actions" variants={itemVariants}>
          <h2>How are you right now?</h2>

          {/* Preset chips */}
          <div className="mood-options">
            {moodOptions.map((option) => (
              <button
                key={option.label}
                className={`mood-pill ${todayEntry?.label === option.label ? 'mood-pill-active' : ''}`}
                type="button"
                disabled={isSaving}
                onClick={() => void handleSelectMood(option.label)}
              >
                <span className="mood-dot" style={{ background: option.tone }} />
                {option.label}
              </button>
            ))}
          </div>

          {/* Custom word input */}
          <form className="mood-custom-form" onSubmit={handleCustomSubmit}>
            <div className="mood-custom-field">
              <input
                ref={inputRef}
                id="customMoodInput"
                type="text"
                className="mood-custom-input"
                placeholder="or type your own word…"
                value={customMood}
                maxLength={24}
                disabled={isSaving}
                onChange={(e) => {
                  // Only allow first word (no spaces mid-entry is fine, we trim on submit)
                  setCustomMood(e.target.value)
                }}
              />
              <button
                className="btn btn-primary mood-custom-btn"
                type="submit"
                disabled={isSaving || !customMood.trim()}
              >
                {isSaving ? '…' : 'Mark today'}
              </button>
            </div>
            <p className="mood-custom-hint">Only the first word will be saved.</p>
          </form>
        </motion.div>
      </motion.div>
    </section>
  )
}
