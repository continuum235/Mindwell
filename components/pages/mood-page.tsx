'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import AnimatedBackdrop from '@/components/layout/animated-backdrop'
import { containerVariants, itemVariants } from '@/lib/animations'
import { fetchJson } from '@/lib/fetcher'
import { getTodayCalendarDay } from '@/lib/date'
import type { MoodEntry } from '@/types/app'

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
  const [selectedDay, setSelectedDay] = useState<number>(getTodayCalendarDay())
  const [selectedLabel, setSelectedLabel] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)

  const existingEntry = useMemo(() => entries.find((e) => e.day === selectedDay), [selectedDay, entries])

  useEffect(() => {
    let active = true

    async function load() {
      const [data] = await Promise.all([
        fetchJson<MoodEntry[]>('/api/moods').catch(() => []),
        new Promise((resolve) => window.setTimeout(resolve, 900)),
      ])

      if (!active) return

      setEntries(data)
      const todayEntry = data.find((e) => e.day === selectedDay)
      if (todayEntry) {
        setSelectedLabel(todayEntry.label)
        setDescription(todayEntry.note ?? '')
      }
      setIsLoading(false)
    }

    load()
    return () => {
      active = false
    }
    // selectedDay is stable (initial value only), so it won't cause re-runs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleDaySelect(day: number) {
    const existing = entries.find((e) => e.day === day)
    setSelectedDay(day)
    setSelectedLabel(existing?.label ?? '')
    setDescription(existing?.note ?? '')
  }

  async function handleSave() {
    if (!selectedLabel) return

    setIsSaving(true)
    const data = await fetchJson<MoodEntry[]>('/api/moods', {
      method: 'POST',
      body: JSON.stringify({
        label: selectedLabel,
        note: description || undefined,
        day: selectedDay,
      }),
    })
    setEntries(data)
    setIsSaving(false)
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
          <div className="mood-calendar">
            {Array.from({ length: 30 }, (_, index) => (
              <div key={`mood-skeleton-${index}`} className="mood-day skeleton skeleton-day" />
            ))}
          </div>
          <div className="mood-editor-shell skeleton">
            <div className="skeleton skeleton-title" />
            <div className="mood-options">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={`mood-pill-${index}`} className="skeleton skeleton-pill" />
              ))}
            </div>
            <div className="skeleton skeleton-textarea" />
            <div className="skeleton skeleton-button" />
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
          Tap a day to log how you felt. Watercolor tones instead of numeric scores — no judgment, just truth.
        </motion.p>

        <motion.div className="mood-calendar" variants={itemVariants}>
          {Array.from({ length: 30 }, (_, index) => {
            const day = index + 1
            const entry = entryByDay.get(day)
            const isSelected = day === selectedDay
            const moodClasses = ['mood-soft', 'mood-rose', 'mood-sage', 'mood-terracotta', 'mood-mist']

            return (
              <button
                key={`day-${day}`}
                type="button"
                className={`mood-day${entry ? ` ${entry.tone} tracked` : ` ${moodClasses[index % moodClasses.length]}`}${isSelected ? ' selected' : ''}`}
                title={entry ? `Day ${day}: ${entry.label}${entry.note ? ` — ${entry.note}` : ''}` : `Day ${day}`}
                onClick={() => handleDaySelect(day)}
              >
                <span className="mood-day-number">{day}</span>
                {entry && (
                  <div className="mood-display">
                    <span className="mood-label">{entry.label}</span>
                    {entry.note && (
                      <span className="mood-has-note" title={entry.note}>
                        ~
                      </span>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </motion.div>

        <motion.div className="mood-editor" variants={itemVariants}>
          <div className="mood-editor-header">
            <h2>Day {selectedDay}</h2>
            {existingEntry && <span className="mood-editor-badge">Logged</span>}
          </div>
          <p className="eyebrow">How are you feeling?</p>
          <div className="mood-options">
            {moodOptions.map((option) => (
              <button
                key={option.label}
                className={`mood-pill${selectedLabel === option.label ? ' mood-pill-active' : ''}`}
                type="button"
                onClick={() => setSelectedLabel(option.label)}
              >
                <span className="mood-dot" style={{ background: option.tone }} />
                {option.label}
              </button>
            ))}
          </div>
          <textarea
            className="mood-note"
            placeholder="Describe how you're feeling (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <button className="btn btn-primary" type="button" disabled={!selectedLabel || isSaving} onClick={handleSave}>
            {isSaving ? 'Saving...' : existingEntry ? 'Update entry' : 'Log this feeling'}
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
