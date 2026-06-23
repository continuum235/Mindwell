'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AnimatedBackdrop from '@/components/layout/animated-backdrop'
import { containerVariants, gridVariants, itemVariants } from '@/lib/animations'
import { fetchJson } from '@/lib/fetcher'
import type { Psychologist } from '@/types/app'

export default function PsychologistsPage({ initialLocation }: { initialLocation: string | null }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [locationQuery, setLocationQuery] = useState(initialLocation ?? '')
  const [psychologists, setPsychologists] = useState<Psychologist[]>([])
  const [searchLabel, setSearchLabel] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [searched, setSearched] = useState(false)

  const performSearch = useCallback(async (location: string) => {
    setIsSearching(true)
    setSearchError('')
    setPsychologists([])
    setSearchLabel('')
    setSearched(true)

    try {
      const data = await fetchJson<{ location: string; results: Psychologist[] }>(
        `/api/psychologists?location=${encodeURIComponent(location)}`,
      )
      setPsychologists(data.results)
      setSearchLabel(data.location)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not find psychologists near that location.'
      setSearchError(msg)
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    if (initialLocation) {
      performSearch(initialLocation)
    }
  }, [initialLocation, performSearch])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const query = locationQuery.trim()
    if (!query) return

    const params = new URLSearchParams(searchParams.toString())
    params.set('location', query)
    router.push(`/psychologists?${params.toString()}`)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Find a Psychologist Near You',
    description: 'Search for licensed psychologists and mental health professionals in your area.',
    url: 'https://mindwell.app/psychologists',
    about: {
      '@type': 'MedicalBusiness',
      name: 'Psychologist',
      description: 'Licensed mental health professionals providing therapy and counseling services.',
    },
  }

  return (
    <section className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AnimatedBackdrop />
      <motion.div className="container" variants={containerVariants} initial="hidden" animate="show">
        <motion.p className="eyebrow" variants={itemVariants}>
          Professional support
        </motion.p>
        <motion.h1 variants={itemVariants}>Find a psychologist near you.</motion.h1>
        <motion.p variants={itemVariants}>
          Search for licensed psychologists and mental health professionals in your area. Type a city or location below
          to find contact details for nearby providers.
        </motion.p>

        <form className="psychologist-search" onSubmit={handleSearch} aria-label="Search for psychologists by location">
          <div className="psychologist-search-field">
            <input
              className="psychologist-input"
              type="text"
              placeholder="Enter a city or location…"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              disabled={isSearching}
              aria-label="Location to search for psychologists"
            />
            <button className="btn btn-primary psychologist-search-btn" type="submit" disabled={isSearching}>
              {isSearching ? 'Searching…' : 'Search'}
            </button>
          </div>
        </form>

        {searchError && (
          <motion.p className="psychologist-error" variants={itemVariants} role="alert">
            {searchError}
          </motion.p>
        )}

        {searchLabel && !searchError && (
          <motion.p className="psychologist-location-label" variants={itemVariants}>
            Showing results near {searchLabel}
          </motion.p>
        )}

        {psychologists.length > 0 && (
          <>
            <motion.p className="psychologist-count" variants={itemVariants}>
              Found {psychologists.length} {psychologists.length === 1 ? 'professional' : 'professionals'}
            </motion.p>
            <motion.div className="psychologist-grid" variants={gridVariants}>
              {psychologists.map((doc) => (
                <motion.article
                  className="psychologist-card"
                  key={doc.id}
                  variants={itemVariants}
                  itemScope
                  itemType="https://schema.org/Physician"
                >
                  <div className="psychologist-card-body">
                    <h2 className="psychologist-name" itemProp="name">
                      {doc.name}
                    </h2>
                    <span className="psychologist-type" itemProp="medicalSpecialty">
                      {doc.type}
                    </span>
                    {doc.address && (
                      <p
                        className="psychologist-detail"
                        itemProp="address"
                        itemScope
                        itemType="https://schema.org/PostalAddress"
                      >
                        <span className="psychologist-icon" aria-hidden="true">
                          &#9906;
                        </span>
                        <span itemProp="streetAddress">{doc.address}</span>
                      </p>
                    )}
                    {doc.phone && (
                      <p className="psychologist-detail">
                        <span className="psychologist-icon" aria-hidden="true">
                          &#9742;
                        </span>
                        <a href={`tel:${doc.phone}`} className="psychologist-link" itemProp="telephone">
                          {doc.phone}
                        </a>
                      </p>
                    )}
                    {doc.website && (
                      <p className="psychologist-detail">
                        <span className="psychologist-icon" aria-hidden="true">
                          &#8599;
                        </span>
                        <a
                          href={doc.website.startsWith('http') ? doc.website : `https://${doc.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="psychologist-link"
                          itemProp="url"
                        >
                          Visit website
                        </a>
                      </p>
                    )}
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </>
        )}

        {searched && !isSearching && psychologists.length === 0 && !searchError && (
          <motion.p className="psychologist-empty" variants={itemVariants}>
            No psychologists found near that location. Try a different city or region.
          </motion.p>
        )}
      </motion.div>
    </section>
  )
}
