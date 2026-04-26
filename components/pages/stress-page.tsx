'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Skeleton } from 'boneyard-js/react'
import AnimatedBackdrop from '@/components/layout/animated-backdrop'
import { containerVariants, gridVariants, itemVariants } from '@/lib/animations'
import { fetchJson } from '@/lib/fetcher'
import type { ResourceItem } from '@/types/app'

const filters = ['All', 'Somatic', 'Breathwork', 'Audio', 'Movement', 'Rituals']

export default function StressPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [resources, setResources] = useState<ResourceItem[]>([])

  useEffect(() => {
    let active = true

    async function load() {
      const [data] = await Promise.all([
        fetchJson<ResourceItem[]>('/api/resources').catch(() => []),
        new Promise((resolve) => window.setTimeout(resolve, 900)),
      ])

      if (!active) {
        return
      }

      setResources(data)
      setIsLoading(false)
    }

    load()

    return () => {
      active = false
    }
  }, [])

  const filteredResources =
    activeFilter === 'All'
      ? resources
      : resources.filter((resource) => resource.type === activeFilter)

  return (
    <section className="page">
      <AnimatedBackdrop />
      <Skeleton name="stress-page" loading={isLoading}>
        <motion.div className="container" variants={containerVariants} initial="hidden" animate="show">
          <motion.p className="eyebrow" variants={itemVariants}>
            Stress care
          </motion.p>
          <motion.h1 variants={itemVariants}>A serene library of gentle resources.</motion.h1>
          <motion.p variants={itemVariants}>
            Choose what your nervous system is asking for today. Every practice is designed for
            softness and safety.
          </motion.p>
          <motion.div className="filter-row" variants={itemVariants}>
            {filters.map((filter) => (
              <button
                key={filter}
                className="filter-chip"
                type="button"
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </motion.div>
          <motion.div className="resource-grid" variants={gridVariants}>
            {filteredResources.map((resource) => (
              <motion.article className="resource-card" key={resource.title} variants={itemVariants}>
                <div className="resource-thumb" style={{ backgroundImage: `url(${resource.image})` }} />
                <div className="resource-body">
                  <h3>{resource.title}</h3>
                  <div className="resource-meta">
                    <span>{resource.type}</span>
                    <span>{resource.duration}</span>
                  </div>
                  <button className="btn btn-outline" type="button">
                    Begin gently
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </Skeleton>
    </section>
  )
}