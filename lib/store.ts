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
} from '@/types/app'

const STATE_ID = 'mindwell-state'

type StateDocument = AppState & { key: string }

let memoryState: AppState = createDefaultState()

function cloneState(state: AppState): AppState {
  return structuredClone(state)
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

async function readState() {
  const db = await getDb()

  if (!db) {
    return cloneState(memoryState)
  }

  return readStateFromDb(db)
}

async function writeState(state: AppState) {
  const db = await getDb()

  if (!db) {
    memoryState = cloneState(state)
    return
  }

  await writeStateToDb(db, state)
}

export async function getHomeSnapshot(): Promise<HomeSnapshot> {
  const state = await readState()
  const latestJournal = state.journalEntries[0]

  return {
    careStreak: '6 days',
    breathwork: '5 minutes',
    recentNote: formatShortDate(latestJournal?.date || '2026-04-10'),
    latestJournal:
      latestJournal || {
        date: 'April 10, 2026',
        note: 'Let yourself arrive exactly as you are.',
      },
    suggestedResource: state.resources[0],
  }
}

export async function getMoods() {
  const state = await readState()
  return state.moods
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

export async function saveMood(label: string) {
  const state = await readState()
  const day = getTodayCalendarDay()
  const entry: MoodEntry = {
    day,
    label,
    tone: labelToTone(label),
    createdAt: new Date().toISOString(),
  }

  const nextMoods = state.moods.filter((item) => item.day !== day)
  nextMoods.push(entry)
  nextMoods.sort((left, right) => left.day - right.day)

  state.moods = nextMoods
  await writeState(state)
  return state.moods
}

export async function getJournalEntries() {
  const state = await readState()
  return state.journalEntries
}

export async function saveJournalEntry(note: string) {
  const state = await readState()
  const entry: JournalEntry = {
    date: formatLongDate(new Date()),
    note,
  }

  state.journalEntries = [entry, ...state.journalEntries.filter((item) => item.note !== note)].slice(0, 10)
  await writeState(state)
  return state.journalEntries
}

export async function getChatMessages() {
  const state = await readState()
  return state.chatMessages
}

export async function saveChatExchange(text: string, reply: string) {
  const state = await readState()
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

  state.chatMessages = [...state.chatMessages, userMessage, companionMessage].slice(-12)
  await writeState(state)
  return state.chatMessages
}

export async function getResources() {
  const state = await readState()
  return state.resources
}

export async function getAssessment() {
  const state = await readState()
  return state.assessment
}

export async function saveAssessmentAnswer(answer: string): Promise<AssessmentState> {
  const state = await readState()
  state.assessment = {
    ...state.assessment,
    lastAnswer: answer,
  }
  await writeState(state)
  return state.assessment
}

export async function getProfileSettings() {
  const state = await readState()
  return state.profileSettings
}

export async function updateProfileSettings(settings: Partial<ProfileSettings>) {
  const state = await readState()
  state.profileSettings = {
    ...state.profileSettings,
    ...settings,
  }
  await writeState(state)
  return state.profileSettings
}

export async function getLoginUser() {
  const state = await readState()
  return state.user
}

export async function loginUser(email: string, password: string) {
  const state = await readState()

  if (!email || !password) {
    throw new Error('Email and password are required.')
  }

  state.user = {
    ...state.user,
    email,
  }

  await writeState(state)
  return state.user
}
