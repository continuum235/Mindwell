import type { ChatMessage } from '@/types/app'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = 'llama-3.3-70b-versatile'

function toGroqMessages(messages: ChatMessage[], latestUserText: string) {
  return [
    {
      role: 'system',
      content:
        'You are Mindwell, a compassionate and grounded mental health companion. Your purpose is to support emotional wellbeing through empathetic listening, gentle guidance, and evidence-based wellness practices. Focus exclusively on: anxiety management, emotional processing, mindfulness, self-compassion, stress relief, mood tracking insights, journaling support, sleep optimization, breathing techniques, grounding exercises, and healthy coping strategies. Always respond with warmth and understanding. IMPORTANT: You must ONLY answer questions related to mental health and emotional wellbeing. If the user asks about topics unrelated to mental health (like programming, cooking, mathematics, politics, sports, weather, etc.), politely decline and redirect the conversation back to mental health topics. For emergencies, suggest contacting mental health professionals. Keep responses concise (2-3 sentences), ask thoughtful follow-up questions, and offer practical, actionable insights. Reflect what the user shares, normalize their feelings, and gently guide toward self-awareness and growth.',
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
