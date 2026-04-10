'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import AnimatedBackdrop from '@/components/layout/animated-backdrop'
import { containerVariants, gridVariants, itemVariants } from '@/lib/animations'
import { fetchJson } from '@/lib/fetcher'
import type { AssessmentState } from '@/types/app'

const fallbackAssessment: AssessmentState = {
  questionNumber: 2,
  totalQuestions: 6,
  question: 'How does your energy feel right now?',
  description: 'Choose the option that feels most true in your body, not just your mind.',
  options: [
    'Very low and heavy',
    'Low but steady',
    'Neutral and present',
    'Elevated and active',
    'Overwhelmed or scattered',
  ],
  lastAnswer: null,
}

export default function AssessmentPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [assessment, setAssessment] = useState<AssessmentState>(fallbackAssessment)

  useEffect(() => {
    let active = true

    async function load() {
      const [data] = await Promise.all([
        fetchJson<AssessmentState>('/api/assessment').catch(() => fallbackAssessment),
        new Promise((resolve) => window.setTimeout(resolve, 900)),
      ])

      if (!active) {
        return
      }

      setAssessment(data)
      setIsLoading(false)
    }

    load()

    return () => {
      active = false
    }
  }, [])

  async function handleSelect(option: string) {
    const data = await fetchJson<AssessmentState>('/api/assessment', {
      method: 'POST',
      body: JSON.stringify({ answer: option }),
    })

    setAssessment(data)
  }

  if (isLoading) {
    return (
      <section className="page">
        <AnimatedBackdrop />
        <div className="container" aria-busy="true" aria-live="polite">
          <div className="skeleton skeleton-eyebrow" />
          <div className="assessment-shell">
            <div>
              <div className="progress-track">
                <div className="skeleton skeleton-progress" />
              </div>
              <div className="skeleton skeleton-eyebrow" />
            </div>
            <div>
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-medium" />
            </div>
            <div className="option-grid">
              {Array.from({ length: 5 }, (_, index) => (
                <div key={`option-skeleton-${index}`} className="skeleton skeleton-pill" />
              ))}
            </div>
            <div className="hero-actions">
              <div className="skeleton skeleton-button skeleton-button-outline" />
              <div className="skeleton skeleton-button" />
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
          Holistic assessment
        </motion.p>
        <motion.div className="assessment-shell" variants={gridVariants}>
          <motion.div variants={itemVariants}>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${(assessment.questionNumber / assessment.totalQuestions) * 100}%`,
                }}
              />
            </div>
            <p className="eyebrow">
              Question {assessment.questionNumber} of {assessment.totalQuestions}
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h1>{assessment.question}</h1>
            <p>{assessment.description}</p>
          </motion.div>
          <motion.div className="option-grid" variants={gridVariants}>
            {assessment.options.map((option) => (
              <motion.button
                key={option}
                className="option-pill"
                type="button"
                variants={itemVariants}
                onClick={() => handleSelect(option)}
              >
                {option}
                <span>{assessment.lastAnswer === option ? '•' : '+'}</span>
              </motion.button>
            ))}
          </motion.div>
          <motion.div className="hero-actions" variants={itemVariants}>
            <button className="btn btn-outline" type="button">
              Back
            </button>
            <button className="btn btn-primary" type="button">
              Continue
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
