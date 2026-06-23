import { prismaClient } from '@/lib/prisma'
import { createDefaultState } from '@/lib/defaults'
import { formatLongDate, formatShortDate, getTodayCalendarDay } from '@/lib/date'
import type {
  AppState,
  AssessmentState,
  ChatMessage,
  HomeSnapshot,
  JournalEntry,
  LoginUser,
  MoodEntry,
  MoodTone,
  ProfileSettings,
  ResourceItem,
} from '@/types/app'

const STATE_ID = 'mindwell-state'

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

async function readStateFromDb(): Promise<AppState> {
  try {
    const state = await prismaClient.globalState.findUnique({
      where: { id: STATE_ID },
    })

    if (state) {
      return {
        moods: (state.moods as unknown as MoodEntry[]) || [],
        journalEntries: (state.journalEntries as unknown as JournalEntry[]) || [],
        resources: (state.resources as unknown as ResourceItem[]) || [],
        chatMessages: (state.chatMessages as unknown as ChatMessage[]) || [],
        profileSettings: (state.profileSettings as unknown as ProfileSettings) || createDefaultState().profileSettings,
        assessment: (state.assessment as unknown as AssessmentState) || createDefaultState().assessment,
        user: (state.user as unknown as LoginUser) || createDefaultState().user,
      }
    }

    const seeded = createDefaultState()
    await prismaClient.globalState.create({
      data: {
        id: STATE_ID,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        moods: seeded.moods as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        journalEntries: seeded.journalEntries as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resources: seeded.resources as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        chatMessages: seeded.chatMessages as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profileSettings: seeded.profileSettings as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        assessment: seeded.assessment as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: seeded.user as any,
      },
    })
    return seeded
  } catch {
    // If database is unavailable, use memory
    return cloneValue(memoryState)
  }
}

async function writeStateToDb(state: AppState) {
  try {
    await prismaClient.globalState.upsert({
      where: { id: STATE_ID },
      update: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        moods: state.moods as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        journalEntries: state.journalEntries as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resources: state.resources as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        chatMessages: state.chatMessages as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profileSettings: state.profileSettings as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        assessment: state.assessment as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: state.user as any,
      },
      create: {
        id: STATE_ID,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        moods: state.moods as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        journalEntries: state.journalEntries as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resources: state.resources as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        chatMessages: state.chatMessages as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profileSettings: state.profileSettings as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        assessment: state.assessment as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: state.user as any,
      },
    })
  } catch {
    // If database is unavailable, use memory
    memoryState = cloneValue(state)
  }
}

import { cache } from 'react'

const getCachedState = cache(async () => {
  return readStateFromDb()
})

async function readState() {
  // Use React cache for request-scoped deduplication
  return getCachedState()
}

async function writeState(state: AppState) {
  await writeStateToDb(state)
}

async function readScopedValue<T>(
  modelName: 'moods' | 'journals' | 'chats' | 'assessments' | 'profiles',
  email: string,
  fallback: T,
  memoryMap: Map<string, T>,
): Promise<T> {
  const normalizedEmail = userKey(email)

  try {
    switch (modelName) {
      case 'moods': {
        const moods = await prismaClient.moodEntry.findMany({
          where: { email: normalizedEmail },
        })
        return (moods.length > 0 ? moods : fallback) as T
      }
      case 'journals': {
        const journals = await prismaClient.journalEntry.findMany({
          where: { email: normalizedEmail },
        })
        return (journals.length > 0 ? journals : fallback) as T
      }
      case 'chats': {
        const messages = await prismaClient.chatMessage.findMany({
          where: { email: normalizedEmail },
        })
        return (messages.length > 0 ? messages : fallback) as T
      }
      case 'assessments': {
        const assessment = await prismaClient.userAssessment.findUnique({
          where: { email: normalizedEmail },
        })
        if (assessment) {
          return ({
            currentQuestionIndex: assessment.currentQuestionIndex,
            answers: assessment.answers,
            completed: assessment.completed,
            resultMessage: assessment.resultMessage,
          } as T)
        }
        return cloneValue(fallback)
      }
      case 'profiles': {
        const profile = await prismaClient.profileSettings.findUnique({
          where: { email: normalizedEmail },
        })
        if (profile) {
          return ({
            dailyReminder: profile.dailyReminder,
            journalLock: profile.journalLock,
            anonymousInsights: profile.anonymousInsights,
          } as T)
        }
        return cloneValue(fallback)
      }
    }
  } catch {
    // If database is unavailable, fall back to memory
    return cloneValue(memoryMap.get(normalizedEmail) ?? fallback)
  }
}

async function writeScopedValue<T>(
  modelName: 'moods' | 'journals' | 'chats' | 'assessments' | 'profiles',
  email: string,
  value: T,
  memoryMap: Map<string, T>,
) {
  const normalizedEmail = userKey(email)

  try {
    switch (modelName) {
      case 'moods': {
        // Clear and re-insert all moods for this user
        await prismaClient.moodEntry.deleteMany({
          where: { email: normalizedEmail },
        })
        const moods = value as T extends MoodEntry[] ? T : MoodEntry[]
        if (Array.isArray(moods)) {
          for (const mood of moods) {
            await prismaClient.moodEntry.create({
              data: {
                email: normalizedEmail,
                day: (mood as MoodEntry).day,
                label: (mood as MoodEntry).label,
                tone: (mood as MoodEntry).tone,
                note: (mood as MoodEntry).note,
                createdAt: new Date((mood as MoodEntry).createdAt),
              },
            })
          }
        }
        break
      }
      case 'journals': {
        // Clear and re-insert all journals for this user
        await prismaClient.journalEntry.deleteMany({
          where: { email: normalizedEmail },
        })
        const journals = value as T extends JournalEntry[] ? T : JournalEntry[]
        if (Array.isArray(journals)) {
          for (const journal of journals) {
            await prismaClient.journalEntry.create({
              data: {
                email: normalizedEmail,
                date: (journal as JournalEntry).date,
                note: (journal as JournalEntry).note,
              },
            })
          }
        }
        break
      }
      case 'chats': {
        // Clear and re-insert all chat messages for this user
        await prismaClient.chatMessage.deleteMany({
          where: { email: normalizedEmail },
        })
        const messages = value as T extends ChatMessage[] ? T : ChatMessage[]
        if (Array.isArray(messages)) {
          for (const message of messages) {
            await prismaClient.chatMessage.create({
              data: {
                email: normalizedEmail,
                sender: (message as ChatMessage).sender,
                text: (message as ChatMessage).text,
                createdAt: new Date((message as ChatMessage).createdAt),
              },
            })
          }
        }
        break
      }
      case 'assessments': {
        const assessment = value as T extends StoredAssessmentProgress ? T : StoredAssessmentProgress
        await prismaClient.userAssessment.upsert({
          where: { email: normalizedEmail },
          create: {
            email: normalizedEmail,
            currentQuestionIndex: (assessment as StoredAssessmentProgress).currentQuestionIndex,
            answers: (assessment as StoredAssessmentProgress).answers,
            completed: (assessment as StoredAssessmentProgress).completed,
            resultMessage: (assessment as StoredAssessmentProgress).resultMessage,
          },
          update: {
            currentQuestionIndex: (assessment as StoredAssessmentProgress).currentQuestionIndex,
            answers: (assessment as StoredAssessmentProgress).answers,
            completed: (assessment as StoredAssessmentProgress).completed,
            resultMessage: (assessment as StoredAssessmentProgress).resultMessage,
          },
        })
        break
      }
      case 'profiles': {
        const profile = value as T extends ProfileSettings ? T : ProfileSettings
        await prismaClient.profileSettings.upsert({
          where: { email: normalizedEmail },
          create: {
            email: normalizedEmail,
            dailyReminder: (profile as ProfileSettings).dailyReminder,
            journalLock: (profile as ProfileSettings).journalLock,
            anonymousInsights: (profile as ProfileSettings).anonymousInsights,
          },
          update: {
            dailyReminder: (profile as ProfileSettings).dailyReminder,
            journalLock: (profile as ProfileSettings).journalLock,
            anonymousInsights: (profile as ProfileSettings).anonymousInsights,
          },
        })
        break
      }
    }
  } catch {
    // If database is unavailable, fall back to memory
    memoryMap.set(normalizedEmail, cloneValue(value))
  }
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
  const safeIndex = Math.min(Math.max(progress?.currentQuestionIndex ?? 0, 0), assessmentQuestions.length - 1)
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
    'assessments',
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

  await writeScopedValue('assessments', email, progress, memoryAssessments)
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

  return readScopedValue('moods', userEmail, [], memoryMoods)
}

export async function saveMood(label: string, note?: string, day?: number, userEmail?: string) {
  const targetDay = day ?? getTodayCalendarDay()
  const entry: MoodEntry = {
    day: targetDay,
    label,
    tone: labelToTone(label),
    note: note?.trim() || undefined,
    createdAt: new Date().toISOString(),
  }

  if (!userEmail) {
    const state = await readState()
    const nextMoods = state.moods.filter((item) => item.day !== targetDay)
    nextMoods.push(entry)
    nextMoods.sort((left, right) => left.day - right.day)
    state.moods = nextMoods
    await writeState(state)
    return state.moods
  }

  const moods = await readScopedValue('moods', userEmail, [], memoryMoods)
  const nextMoods = moods.filter((item) => item.day !== targetDay)
  nextMoods.push(entry)
  nextMoods.sort((left, right) => left.day - right.day)
  await writeScopedValue('moods', userEmail, nextMoods, memoryMoods)
  return nextMoods
}

export async function getJournalEntries(userEmail?: string) {
  if (!userEmail) {
    const state = await readState()
    return state.journalEntries
  }

  return readScopedValue('journals', userEmail, [], memoryJournals)
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

  const entries = await readScopedValue('journals', userEmail, [], memoryJournals)
  const nextEntries = [entry, ...entries.filter((item) => item.note !== note)].slice(0, 10)
  await writeScopedValue('journals', userEmail, nextEntries, memoryJournals)
  return nextEntries
}

export async function getChatMessages(userEmail?: string) {
  if (!userEmail) {
    const state = await readState()
    return state.chatMessages
  }

  return readScopedValue('chats', userEmail, [], memoryChats)
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

  const messages = await readScopedValue('chats', userEmail, [], memoryChats)
  const nextMessages = [...messages, userMessage, companionMessage].slice(-12)
  await writeScopedValue('chats', userEmail, nextMessages, memoryChats)
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

  return readScopedValue('profiles', userEmail, createDefaultState().profileSettings, memoryProfiles)
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

  await writeScopedValue('profiles', userEmail, nextProfile, memoryProfiles)
  return nextProfile
}

export async function getLoginUser() {
  const state = await readState()
  return state.user
}

export async function getResourcesForHome(): Promise<ResourceItem[]> {
  return getResources()
}

