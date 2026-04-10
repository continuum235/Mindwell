import type { ChatMessage } from '@/types/app'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = 'llama-3.3-70b-versatile'

function toGroqMessages(messages: ChatMessage[], latestUserText: string) {
  return [
    {
      role: 'system',
      content:
        'You are Mindwell, a calm and supportive mental wellness companion. Respond with empathy, stay grounded, avoid diagnosis, and offer short practical reflection prompts when helpful.',
    },
    ...messages.map((message) => ({
      role: message.sender === 'companion' ? 'assistant' : 'user',
      content: message.text,
    })),
    {
      role: 'user',
      content: latestUserText,
    },
  ]
}

export async function generateCompanionReply(messages: ChatMessage[], latestUserText: string) {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured.')
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || DEFAULT_MODEL,
      temperature: 0.6,
      max_tokens: 300,
      messages: toGroqMessages(messages, latestUserText),
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Groq request failed (${response.status}): ${body}`)
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }

  const content = data.choices?.[0]?.message?.content?.trim()

  if (!content) {
    throw new Error('Groq returned an empty response.')
  }

  return content
}
