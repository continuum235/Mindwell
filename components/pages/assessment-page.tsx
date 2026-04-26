'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Skeleton } from 'boneyard-js/react'
import AnimatedBackdrop from '@/components/layout/animated-backdrop'
import { containerVariants, gridVariants, itemVariants } from '@/lib/animations'
import { fetchJson } from '@/lib/fetcher'
import type { AssessmentState } from '@/types/app'

const fallbackAssessment: AssessmentState = {
  currentQuestionIndex: 0,
  questionNumber: 1,
  totalQuestions: 5,
  question: 'How often have you felt little interest or pleasure in doing things?',
  description: 'Choose the response that best matches the last two weeks.',
  options: [
    'Not at all',
    'Several days',
    'More than half the days',
    'Nearly every day',
  ],
  lastAnswer: null,
  answers: [],
  completed: false,
  resultMessage: null,
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

  async function handleAction(action: 'back' | 'continue' | 'reset') {
    const data = await fetchJson<AssessmentState>('/api/assessment', {
      method: 'PATCH',
      body: JSON.stringify({ action }),
    })

    setAssessment(data)
  }

  return (
    <section className="page">
      <AnimatedBackdrop />
      <Skeleton name="assessment-page" loading={isLoading}>
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
                    width: `${(assessment.answers.length / assessment.totalQuestions) * 100}%`,
                  }}
                />
              </div>
              <p className="eyebrow">
                {assessment.completed
                  ? 'Assessment complete'
                  : `Question ${assessment.questionNumber} of ${assessment.totalQuestions}`}
              </p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h1>{assessment.completed ? 'Your reflection summary' : assessment.question}</h1>
              <p>{assessment.completed ? assessment.resultMessage : assessment.description}</p>
            </motion.div>
            {assessment.completed ? (
              <motion.div className="card" variants={itemVariants}>
                <p className="eyebrow">Responses captured</p>
                <p>{assessment.answers.join(' • ')}</p>
              </motion.div>
            ) : (
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
            )}
            <motion.div className="hero-actions" variants={itemVariants}>
              <button
                className="btn btn-outline"
                type="button"
                disabled={!assessment.completed && assessment.currentQuestionIndex === 0}
                onClick={() => void handleAction(assessment.completed ? 'reset' : 'back')}
              >
                {assessment.completed ? 'Retake' : 'Back'}
              </button>
              <button
                className="btn btn-primary"
                type="button"
                disabled={assessment.completed || !assessment.lastAnswer}
                onClick={() => void handleAction('continue')}
              >
                Continue
              </button>
            </motion.div>
            {assessment.completed ? (
              <motion.p className="eyebrow" variants={itemVariants}>
                This reflection is not a diagnosis. Reach out to a qualified professional if you need
                more support.
              </motion.p>
            ) : null}
          </motion.div>
        </motion.div>
      </Skeleton>
    </section>
  )
}