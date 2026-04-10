'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AnimatedBackdrop from '@/components/layout/animated-backdrop'
import { containerVariants, itemVariants } from '@/lib/animations'

export default function LoginPage() {
  const router = useRouter()
  const { status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 900)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/')
    }
  }, [router, status])

  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  function validateForm(): boolean {
    if (!email.trim()) {
      setError('Email is required.')
      return false
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return false
    }
    if (!password.trim()) {
      setError('Password is required.')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return false
    }
    if (isSignUp) {
      if (!displayName.trim()) {
        setError('Name is required.')
        return false
      }
      if (!confirmPassword.trim()) {
        setError('Please confirm your password.')
        return false
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return false
      }
    }
    return true
  }

  async function handleLogin() {
    setError('')
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Sign in failed. Check your email and password.')
        setIsSubmitting(false)
        return
      }

      router.push('/')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  async function handleSignUp() {
    setError('')
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: displayName,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Sign up failed. Please try again.')
        setIsSubmitting(false)
        return
      }

      // Sign in after successful signup
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.error) {
        setError('Account created, but sign in failed. Please try signing in.')
        setIsSubmitting(false)
        return
      }

      router.push('/')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  function toggleMode() {
    setIsSignUp(!isSignUp)
    setError('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setDisplayName('')
  }

  if (isLoading) {
    return (
      <section className="page">
        <AnimatedBackdrop />
        <div className="container" aria-busy="true" aria-live="polite">
          <div className="login-page">
            <div className="login-media skeleton skeleton-media" />
            <div className="login-panel">
              <div className="skeleton skeleton-eyebrow" />
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-medium" />
              <div className="form">
                {isSignUp && <div className="skeleton skeleton-input" />}
                <div className="skeleton skeleton-input" />
                <div className="skeleton skeleton-input" />
                {isSignUp && <div className="skeleton skeleton-input" />}
                <div className="skeleton skeleton-button" />
                <div className="login-footer">
                  <div className="skeleton skeleton-line skeleton-short" />
                  <div className="skeleton skeleton-link" />
                </div>
              </div>
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
        <motion.div className="login-page" variants={containerVariants}>
          <motion.div className="login-media" aria-hidden="true" variants={itemVariants} />
          <motion.div className="login-panel" variants={itemVariants}>
            <div className="auth-header">
              <p className="eyebrow">{isSignUp ? 'Create your account' : 'Welcome back to your space'}</p>
              <h1>{isSignUp ? 'Join Mindwell' : 'Sign in to Mindwell'}</h1>
              <p>A private, compassionate space for daily reflection and somatic care.</p>
            </div>

            <form
              className="form"
              onSubmit={(event) => {
                event.preventDefault()
                if (isSignUp) {
                  void handleSignUp()
                } else {
                  void handleLogin()
                }
              }}
            >
              {isSignUp && (
                <div className="field">
                  <input
                    id="displayName"
                    type="text"
                    placeholder=" "
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="displayName">Your name</label>
                </div>
              )}
              <div className="field">
                <input
                  id="email"
                  type="email"
                  placeholder=" "
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isSubmitting}
                />
                <label htmlFor="email">Email address</label>
              </div>
              <div className="field">
                <input
                  id="password"
                  type="password"
                  placeholder=" "
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                />
                <label htmlFor="password">Password</label>
              </div>
              {isSignUp && (
                <div className="field">
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder=" "
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="confirmPassword">Confirm password</label>
                </div>
              )}
              {error && (
                <div className="auth-error" role="alert">
                  {error}
                </div>
              )}
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Please wait...' : isSignUp ? 'Create account' : 'Enter your space'}
              </button>

              <div className="auth-toggle">
                <span>{isSignUp ? 'Already have an account?' : 'New to Mindwell?'}</span>
                <button
                  type="button"
                  className="text-link"
                  onClick={toggleMode}
                  disabled={isSubmitting}
                >
                  {isSignUp ? 'Sign in' : 'Create an account'}
                </button>
              </div>

              {!isSignUp && (
                <div className="login-footer">
                  <span>Need a gentle reset?</span>
                  <Link className="text-link" href="/about">
                    Read our ethos
                  </Link>
                </div>
              )}
            </form>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
