'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import AnimatedBackdrop from '@/components/layout/animated-backdrop'
import { containerVariants, gridVariants, itemVariants } from '@/lib/animations'
import { fetchJson } from '@/lib/fetcher'
import type { ProfileSettings } from '@/types/app'

const fallbackSettings: ProfileSettings = {
  dailyReminder: true,
  journalLock: false,
  anonymousInsights: true,
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<ProfileSettings>(fallbackSettings)

  useEffect(() => {
    let active = true

    async function load() {
      const [data] = await Promise.all([
        fetchJson<ProfileSettings>('/api/profile').catch(() => fallbackSettings),
        new Promise((resolve) => window.setTimeout(resolve, 900)),
      ])

      if (!active) {
        return
      }

      setSettings(data)
      setIsLoading(false)
    }

    load()

    return () => {
      active = false
    }
  }, [])

  async function updateSettings(nextSettings: Partial<ProfileSettings>) {
    const data = await fetchJson<ProfileSettings>('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(nextSettings),
    })

    setSettings(data)
  }

  if (isLoading) {
    return (
      <section className="page">
        <AnimatedBackdrop />
        <div className="container" aria-busy="true" aria-live="polite">
          <div className="skeleton skeleton-eyebrow" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="settings-list">
            {Array.from({ length: 3 }, (_, index) => (
              <div className="setting-card" key={`setting-skeleton-${index}`}>
                <div className="setting-row">
                  <div className="skeleton-stack">
                    <div className="skeleton skeleton-title" />
                    <div className="skeleton skeleton-line" />
                    <div className="skeleton skeleton-line skeleton-medium" />
                  </div>
                  <div className="skeleton skeleton-toggle" />
                </div>
              </div>
            ))}
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
          Profile
        </motion.p>
        <motion.h1 variants={itemVariants}>Your settings, softly organized.</motion.h1>
        <motion.p variants={itemVariants}>
          Adjust your experience with care. Every choice is explained in gentle, human language.
        </motion.p>
        <motion.div className="settings-list" variants={gridVariants}>
          <motion.div className="setting-card" variants={itemVariants}>
            <div className="setting-row">
              <div>
                <h3>Daily check-in reminder</h3>
                <p>Receive a calm notification inviting you to pause and notice your body.</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.dailyReminder}
                  onChange={(event) => void updateSettings({ dailyReminder: event.target.checked })}
                />
              </label>
            </div>
          </motion.div>
          <motion.div className="setting-card" variants={itemVariants}>
            <div className="setting-row">
              <div>
                <h3>Private journal lock</h3>
                <p>Add an extra layer of privacy before opening your journal entries.</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.journalLock}
                  onChange={(event) => void updateSettings({ journalLock: event.target.checked })}
                />
              </label>
            </div>
          </motion.div>
          <motion.div className="setting-card" variants={itemVariants}>
            <div className="setting-row">
              <div>
                <h3>Share anonymous insights</h3>
                <p>Help Mindwell improve without sharing your personal content.</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.anonymousInsights}
                  onChange={(event) =>
                    void updateSettings({ anonymousInsights: event.target.checked })
                  }
                />
              </label>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
