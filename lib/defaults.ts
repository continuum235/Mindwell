import type {
  AppState,
  ChatMessage,
  JournalEntry,
  MoodEntry,
  ProfileSettings,
  ResourceItem,
} from '@/types/app'

const defaultMoods: MoodEntry[] = [
  { day: 3, label: 'Tender', tone: 'mood-rose', createdAt: '2026-04-03T08:00:00.000Z' },
  { day: 8, label: 'Grounded', tone: 'mood-sage', createdAt: '2026-04-08T08:00:00.000Z' },
  { day: 12, label: 'Restless', tone: 'mood-terracotta', createdAt: '2026-04-12T08:00:00.000Z' },
  { day: 18, label: 'Open', tone: 'mood-soft', createdAt: '2026-04-18T08:00:00.000Z' },
  { day: 24, label: 'Clear', tone: 'mood-mist', createdAt: '2026-04-24T08:00:00.000Z' },
]

const defaultJournalEntries: JournalEntry[] = [
  {
    date: 'April 10, 2026',
    note: 'Let myself slow down and rest my palms on my chest.',
  },
  {
    date: 'April 08, 2026',
    note: 'Noticed the morning light and breathed with it.',
  },
  {
    date: 'April 05, 2026',
    note: 'Wrote a small list of what feels safe today.',
  },
]

const defaultResources: ResourceItem[] = [
  {
    title: 'Shoulder release in soft light',
    type: 'Somatic',
    duration: '8 min',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Warm breath for a busy mind',
    type: 'Breathwork',
    duration: '5 min',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Grounding audio with rain',
    type: 'Audio',
    duration: '12 min',
    image:
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Slow movement for hips',
    type: 'Movement',
    duration: '10 min',
    image:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80',
  },
]

const defaultChatMessages: ChatMessage[] = [
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
]

const defaultProfileSettings: ProfileSettings = {
  dailyReminder: true,
  journalLock: false,
  anonymousInsights: true,
}

export function createDefaultState(): AppState {
  return {
    moods: structuredClone(defaultMoods),
    journalEntries: structuredClone(defaultJournalEntries),
    resources: structuredClone(defaultResources),
    chatMessages: structuredClone(defaultChatMessages),
    profileSettings: structuredClone(defaultProfileSettings),
    assessment: {
      questionNumber: 2,
      totalQuestions: 6,
      question: 'How does your energy feel right now?',
      description:
        'Choose the option that feels most true in your body, not just your mind.',
      options: [
        'Very low and heavy',
        'Low but steady',
        'Neutral and present',
        'Elevated and active',
        'Overwhelmed or scattered',
      ],
      lastAnswer: null,
    },
    user: {
      email: 'hello@mindwell.app',
      name: 'Mindwell Member',
    },
  }
}
