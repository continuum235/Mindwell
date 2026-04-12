'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import AnimatedBackdrop from '@/components/layout/animated-backdrop'
import { containerVariants, itemVariants } from '@/lib/animations'
import { fetchJson } from '@/lib/fetcher'
import type { ChatMessage } from '@/types/app'

const fallbackMessages: ChatMessage[] = [
  {
    sender: 'companion',
    text: 'Hello, I am here with you. What feels most present today?',
    createdAt: '2026-04-11T09:00:00.000Z',
  },
  {
    sender: 'user',
    text: 'I feel a little tight in my chest and distracted.',
    createdAt: '2026-04-11T09:01:00.000Z',
  },
  {
    sender: 'companion',
    text: 'Thank you for noticing that. Would you like a short grounding cue?',
    createdAt: '2026-04-11T09:02:00.000Z',
  },
  {
    sender: 'user',
    text: 'Yes, please. That would help.',
    createdAt: '2026-04-11T09:03:00.000Z',
  },
  {
    sender: 'companion',
    text: 'Let\'s try the 5-4-3-2-1 technique. Name 5 things you can see around you right now.',
    createdAt: '2026-04-11T09:04:00.000Z',
  },
  {
    sender: 'user',
    text: 'I see my desk, a lamp, a plant, my phone, and the window.',
    createdAt: '2026-04-11T09:05:00.000Z',
  },
  {
    sender: 'companion',
    text: 'Great! Now name 4 things you can physically feel or touch.',
    createdAt: '2026-04-11T09:06:00.000Z',
  },
  {
    sender: 'user',
    text: 'The chair beneath me, my feet on the floor, the breeze from the window, and my hands on the desk.',
    createdAt: '2026-04-11T09:07:00.000Z',
  },
  {
    sender: 'companion',
    text: 'Wonderful progress. How are you feeling now? Has the tightness eased a bit?',
    createdAt: '2026-04-11T09:08:00.000Z',
  },
  {
    sender: 'user',
    text: 'Yes, actually. I feel a bit calmer now.',
    createdAt: '2026-04-11T09:09:00.000Z',
  },
  {
    sender: 'companion',
    text: 'I\'m glad to hear that. Remember, you can use this technique anytime you need to ground yourself. What would help you most right now?',
    createdAt: '2026-04-11T09:10:00.000Z',
  },
]

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>(fallbackMessages)
  const [input, setInput] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      const [data] = await Promise.all([
        fetchJson<ChatMessage[]>('/api/chat').catch(() => fallbackMessages),
        new Promise((resolve) => window.setTimeout(resolve, 900)),
      ])

      if (!active) {
        return
      }

      setMessages(data)
      setIsLoading(false)
    }

    load()

    return () => {
      active = false
    }
  }, [])

  async function handleSend() {
    const text = input.trim()

    if (!text) {
      return
    }

    const data = await fetchJson<ChatMessage[]>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })

    setMessages(data)
    setInput('')
  }

  if (isLoading) {
    return (
      <section className="page">
        <AnimatedBackdrop />
        <div className="container" aria-busy="true" aria-live="polite">
          <div className="skeleton skeleton-eyebrow" />
          <div className="skeleton skeleton-title" />
          <div className="chat-shell">
            <div className="chat-thread">
              <div className="message-row">
                <div className="skeleton skeleton-bubble" />
              </div>
              <div className="message-row">
                <div className="skeleton skeleton-bubble skeleton-bubble-short" />
              </div>
              <div className="message-row">
                <div className="skeleton skeleton-bubble" />
              </div>
            </div>
            <div className="chat-input">
              <div className="skeleton skeleton-input" />
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
          Mindful companion
        </motion.p>
        <motion.h1 variants={itemVariants}>A calm conversation, held gently.</motion.h1>
        <motion.div className="chat-shell" variants={itemVariants}>
          <div className="chat-thread">
            {messages.map((message, index) => (
              <div className="message-row" key={`${message.sender}-${message.createdAt}-${index}`}>
                <div className={`message ${message.sender}`}>{message.text}</div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Share what you are feeling..."
              aria-label="Message input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void handleSend()
                }
              }}
            />
            <button className="btn btn-primary" type="button" onClick={() => void handleSend()}>
              Send
            </button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
