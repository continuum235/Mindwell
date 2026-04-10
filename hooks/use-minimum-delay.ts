'use client'

import { useEffect, useState } from 'react'

export function useMinimumDelay(delayMs = 900) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), delayMs)
    return () => window.clearTimeout(timer)
  }, [delayMs])

  return isLoading
}
