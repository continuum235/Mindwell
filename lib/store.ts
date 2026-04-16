import type { Db } from 'mongodb'
import { createDefaultState } from '@/lib/defaults'
import { formatLongDate, formatShortDate, getTodayCalendarDay } from '@/lib/date'
import { getDb } from '@/lib/mongodb'
import type {
  AppState,
  AssessmentState,
  ChatMessage,
  HomeSnapshot,
  JournalEntry,
  MoodEntry,
  MoodTone,
  ProfileSettings,
  ResourceItem,
} from '@/types/app'

const STATE_ID = 'mindwell-state'

type StateDocument = AppState & { key: string }

interface AssessmentQuestion {
  question: string
  description: string
  options: string[]
}

interface StoredAssessmentProgress {
  currentQuestionIndex: number
  answers: string[]
  completed: boolean
  resultMessage: string | null
}

let memoryState: AppState = createDefaultState()
const memoryMoods = new Map<string, MoodEntry[]>()
const memoryJournals = new Map<string, JournalEntry[]>()
const memoryChats = new Map<string, ChatMessage[]>()
const memoryProfiles = new Map<string, ProfileSettings>()
const memoryAssessments = new Map<string, StoredAssessmentProgress>()

const assessmentQuestions: AssessmentQuestion[] = [
  {
    question: 'How often have you felt little interest or pleasure in doing things?',
    description: 'Choose the response that best matches the last two weeks.',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  },
  {
    question: 'How often have you felt down, depressed, or hopeless?',
    description: 'Answer from lived experience rather than what you think you should say.',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  },
  {
    question: 'How often have you had trouble falling or staying asleep, or sleeping too much?',
    description: 'Notice your sleep pattern with as much honesty and gentleness as possible.',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  },
  {
    question: 'How often have you felt tired or had little energy?',
    description: 'Think about your energy across ordinary daily activities.',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  },
  {
    question: 'How often have you had poor appetite or overeaten?',
    description: 'Reflect on the pattern, not one unusually hard day.',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  },
]

function cloneValue<T>(value: T): T {
  return structuredClone(value)
}

function userKey(email: string) {
  return email.trim().toLowerCase()
}

async function readStateFromDb(db: Db): Promise<AppState> {
  const collection = db.collection('app_state')
  const existing = (await collection.findOne({ key: STATE_ID })) as StateDocument | null

  if (existing) {
    const { key, ...state } = existing
    void key
    return state
  }

  const seeded = createDefaultState()
  await collection.replaceOne({ key: STATE_ID }, { key: STATE_ID, ...seeded }, { upsert: true })
  return seeded
}

async function writeStateToDb(db: Db, state: AppState) {
  const collection = db.collection('app_state')
  await collection.replaceOne({ key: STATE_ID }, { key: STATE_ID, ...state }, { upsert: true })
}

import { cache } from 'react'

const getCachedState = cache(async (db: Db) => {
  return readStateFromDb(db)
})

async function readState() {
  const db = await getDb()

  if (!db) {
    return cloneValue(memoryState)
  }

  // Use React cache for request-scoped deduplication
  return getCachedState(db)
}

async function writeState(state: AppState) {
  const db = await getDb()

  if (!db) {
    memoryState = cloneValue(state)
    return
  }

  await writeStateToDb(db, state)
}

async function readScopedValue<T>(
  collectionName: string,
  keyPrefix: string,
  email: string,
  fallback: T,
  memoryMap: Map<string, T>,
): Promise<T> {
  const normalizedEmail = userKey(email)
  const db = await getDb()

  if (!db) {
    return cloneValue(memoryMap.get(normalizedEmail) ?? fallback)
  }

  const collection = db.collection<{ key: string; value: T }>(collectionName)
  const doc = await collection.findOne({ key: `${keyPrefix}-${normalizedEmail}` })
  return cloneValue(doc?.value ?? fallback)
}

async function writeScopedValue<T>(
  collectionName: string,
  keyPrefix: string,
  email: string,
  value: T,
  memoryMap: Map<string, T>,
) {
  const normalizedEmail = userKey(email)
  const db = await getDb()

  if (!db) {
    memoryMap.set(normalizedEmail, cloneValue(value))
    return
  }

  const collection = db.collection<{ key: string; value: T }>(collectionName)
  await collection.updateOne(
    { key: `${keyPrefix}-${normalizedEmail}` },
    { $set: { value } },
    { upsert: true },
  )
}

function labelToTone(label: string): MoodTone {
  switch (label) {
    case 'Tender':
      return 'mood-rose'
    case 'Restless':
      return 'mood-terracotta'
    case 'Grounded':
      return 'mood-sage'
    case 'Clear':
      return 'mood-mist'
    case 'Open':
    default:
      return 'mood-soft'
  }
}

function calculateCareStreak(moods: MoodEntry[]) {
  if (moods.length === 0) {
    return '0 days'
  }

  const sortedDays = Array.from(new Set(moods.map((entry) => entry.day))).sort((left, right) => right - left)
  const today = getTodayCalendarDay()
  let expectedDay = sortedDays[0] === today ? today : Math.min(today, sortedDays[0])
  let streak = 0

  for (const day of sortedDays) {
    if (day !== expectedDay) {
      break
    }

    streak += 1
    expectedDay -= 1
  }

  return `${streak} day${streak === 1 ? '' : 's'}`
}

function getAssessmentResultMessage(score: number) {
  if (score <= 5) {
    return 'Your responses suggest minimal symptoms right now.'
  }

  if (score <= 10) {
    return 'Your responses suggest mild symptoms. More rest and support may help.'
  }

  if (score <= 15) {
    return 'Your responses suggest moderate symptoms. Consider talking with a mental health professional.'
  }

  return 'Your responses suggest more severe distress. Professional support would be a good next step.'
}

function buildAssessmentState(progress?: Partial<StoredAssessmentProgress>): AssessmentState {
  const answers = cloneValue(progress?.answers ?? [])
  const completed = progress?.completed === true
  const resultMessage = progress?.resultMessage ?? null
  const safeIndex = Math.min(
    Math.max(progress?.currentQuestionIndex ?? 0, 0),
    assessmentQuestions.length - 1,
  )
  const question = assessmentQuestions[safeIndex]

  return {
    currentQuestionIndex: safeIndex,
    questionNumber: safeIndex + 1,
    totalQuestions: assessmentQuestions.length,
    question: question.question,
    description: question.description,
    options: cloneValue(question.options),
    lastAnswer: answers[safeIndex] ?? null,
    answers,
    completed,
    resultMessage,
  }
}

async function readAssessmentProgress(email?: string) {
  if (!email) {
    const state = await readState()
    return {
      currentQuestionIndex: state.assessment.currentQuestionIndex ?? 0,
      answers: cloneValue(state.assessment.answers ?? []),
      completed: state.assessment.completed ?? false,
      resultMessage: state.assessment.resultMessage ?? null,
    }
  }

  return readScopedValue(
    'user_assessments',
    'assessment',
    email,
    { currentQuestionIndex: 0, answers: [], completed: false, resultMessage: null },
    memoryAssessments,
  )
}

async function writeAssessmentProgress(progress: StoredAssessmentProgress, email?: string) {
  if (!email) {
    const state = await readState()
    state.assessment = buildAssessmentState(progress)
    await writeState(state)
    return
  }

  await writeScopedValue('user_assessments', 'assessment', email, progress, memoryAssessments)
}

export async function getHomeSnapshot(userEmail?: string): Promise<HomeSnapshot> {
  // If no user email, we can read the entire state once
  if (!userEmail) {
    const state = await readState()
    const latestJournal = state.journalEntries[0]
    return {
      careStreak: calculateCareStreak(state.moods),
      breathwork: '5 minutes',
      recentNote: formatShortDate(latestJournal?.date || '2026-04-10'),
      latestJournal: latestJournal || {
        date: 'April 10, 2026',
        note: 'Let yourself arrive exactly as you are.',
      },
      suggestedResource: state.resources[0],
    }
  }

  // For logged in users, fetch in parallel (already good, but ensure individual functions are optimized)
  const [journals, moods, resources] = await Promise.all([
    getJournalEntries(userEmail),
    getMoods(userEmail),
    getResources(),
  ])
  const latestJournal = journals[0]

  return {
    careStreak: calculateCareStreak(moods),
    breathwork: '5 minutes',
    recentNote: formatShortDate(latestJournal?.date || '2026-04-10'),
    latestJournal: latestJournal || {
      date: 'April 10, 2026',
      note: 'Let yourself arrive exactly as you are.',
    },
    suggestedResource: resources[0],
  }
}

export async function getMoods(userEmail?: string) {
  if (!userEmail) {
    const state = await readState()
    return state.moods
  }

  return readScopedValue('user_moods', 'moods', userEmail, [], memoryMoods)
}

export async function saveMood(label: string, userEmail?: string) {
  const day = getTodayCalendarDay()
  const entry: MoodEntry = {
    day,
    label,
    tone: labelToTone(label),
    createdAt: new Date().toISOString(),
  }

  if (!userEmail) {
    const state = await readState()
    const nextMoods = state.moods.filter((item) => item.day !== day)
    nextMoods.push(entry)
    nextMoods.sort((left, right) => left.day - right.day)
    state.moods = nextMoods
    await writeState(state)
    return state.moods
  }

  const moods = await readScopedValue('user_moods', 'moods', userEmail, [], memoryMoods)
  const nextMoods = moods.filter((item) => item.day !== day)
  nextMoods.push(entry)
  nextMoods.sort((left, right) => left.day - right.day)
  await writeScopedValue('user_moods', 'moods', userEmail, nextMoods, memoryMoods)
  return nextMoods
}

export async function getJournalEntries(userEmail?: string) {
  if (!userEmail) {
    const state = await readState()
    return state.journalEntries
  }

  return readScopedValue('user_journals', 'journal', userEmail, [], memoryJournals)
}

export async function saveJournalEntry(note: string, userEmail?: string) {
  const entry: JournalEntry = {
    date: formatLongDate(new Date()),
    note,
  }

  if (!userEmail) {
    const state = await readState()
    state.journalEntries = [entry, ...state.journalEntries.filter((item) => item.note !== note)].slice(0, 10)
    await writeState(state)
    return state.journalEntries
  }

  const entries = await readScopedValue('user_journals', 'journal', userEmail, [], memoryJournals)
  const nextEntries = [entry, ...entries.filter((item) => item.note !== note)].slice(0, 10)
  await writeScopedValue('user_journals', 'journal', userEmail, nextEntries, memoryJournals)
  return nextEntries
}

export async function getChatMessages(userEmail?: string) {
  if (!userEmail) {
    const state = await readState()
    return state.chatMessages
  }

  return readScopedValue('user_chats', 'chat', userEmail, [], memoryChats)
}

export async function saveChatExchange(text: string, reply: string, userEmail?: string) {
  const userMessage: ChatMessage = {
    sender: 'user',
    text,
    createdAt: new Date().toISOString(),
  }
  const companionMessage: ChatMessage = {
    sender: 'companion',
    text: reply,
    createdAt: new Date().toISOString(),
  }

  if (!userEmail) {
    const state = await readState()
    state.chatMessages = [...state.chatMessages, userMessage, companionMessage].slice(-12)
    await writeState(state)
    return state.chatMessages
  }

  const messages = await readScopedValue('user_chats', 'chat', userEmail, [], memoryChats)
  const nextMessages = [...messages, userMessage, companionMessage].slice(-12)
  await writeScopedValue('user_chats', 'chat', userEmail, nextMessages, memoryChats)
  return nextMessages
}

export async function getResources() {
  const state = await readState()
  return state.resources
}

export async function getAssessment(userEmail?: string) {
  return buildAssessmentState(await readAssessmentProgress(userEmail))
}

export async function saveAssessmentAnswer(answer: string, userEmail?: string): Promise<AssessmentState> {
  const progress = await readAssessmentProgress(userEmail)
  const answers = cloneValue(progress.answers)
  const currentIndex = Math.min(progress.currentQuestionIndex, assessmentQuestions.length - 1)

  answers[currentIndex] = answer

  const nextIndex = Math.min(currentIndex + 1, assessmentQuestions.length - 1)
  const completed = answers.filter(Boolean).length === assessmentQuestions.length
  const score = answers.reduce((total, entry) => {
    return total + Math.max(assessmentQuestions[0].options.indexOf(entry), 0)
  }, 0)

  const nextProgress: StoredAssessmentProgress = {
    currentQuestionIndex: completed ? assessmentQuestions.length - 1 : nextIndex,
    answers,
    completed,
    resultMessage: completed ? getAssessmentResultMessage(score) : null,
  }

  await writeAssessmentProgress(nextProgress, userEmail)
  return buildAssessmentState(nextProgress)
}

export async function moveAssessment(direction: 'back' | 'continue' | 'reset', userEmail?: string) {
  if (direction === 'reset') {
    const resetProgress: StoredAssessmentProgress = {
      currentQuestionIndex: 0,
      answers: [],
      completed: false,
      resultMessage: null,
    }

    await writeAssessmentProgress(resetProgress, userEmail)
    return buildAssessmentState(resetProgress)
  }

  const progress = await readAssessmentProgress(userEmail)
  let nextIndex = progress.currentQuestionIndex

  if (direction === 'back') {
    nextIndex = Math.max(0, nextIndex - 1)
  } else if (progress.answers[nextIndex]) {
    nextIndex = Math.min(assessmentQuestions.length - 1, nextIndex + 1)
  }

  const nextProgress: StoredAssessmentProgress = {
    ...progress,
    currentQuestionIndex: nextIndex,
  }

  await writeAssessmentProgress(nextProgress, userEmail)
  return buildAssessmentState(nextProgress)
}

export async function getProfileSettings(userEmail?: string) {
  if (!userEmail) {
    const state = await readState()
    return state.profileSettings
  }

  return readScopedValue(
    'user_profiles',
    'profile',
    userEmail,
    createDefaultState().profileSettings,
    memoryProfiles,
  )
}

export async function updateProfileSettings(settings: Partial<ProfileSettings>, userEmail?: string) {
  if (!userEmail) {
    const state = await readState()
    state.profileSettings = {
      ...state.profileSettings,
      ...settings,
    }
    await writeState(state)
    return state.profileSettings
  }

  const profile = await getProfileSettings(userEmail)
  const nextProfile = {
    ...profile,
    ...settings,
  }

  await writeScopedValue('user_profiles', 'profile', userEmail, nextProfile, memoryProfiles)
  return nextProfile
}

export async function getLoginUser() {
  const state = await readState()
  return state.user
}

export async function getResourcesForHome(): Promise<ResourceItem[]> {
  return getResources()
}
