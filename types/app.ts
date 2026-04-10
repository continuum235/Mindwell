export type MoodTone =
  | 'mood-soft'
  | 'mood-rose'
  | 'mood-sage'
  | 'mood-terracotta'
  | 'mood-mist'

export interface MoodEntry {
  day: number
  label: string
  tone: MoodTone
  createdAt: string
}

export interface JournalEntry {
  date: string
  note: string
}

export interface ResourceItem {
  title: string
  type: string
  duration: string
  image: string
}

export interface ChatMessage {
  sender: 'companion' | 'user'
  text: string
  createdAt: string
}

export interface ProfileSettings {
  dailyReminder: boolean
  journalLock: boolean
  anonymousInsights: boolean
}

export interface AssessmentState {
  questionNumber: number
  totalQuestions: number
  question: string
  description: string
  options: string[]
  lastAnswer: string | null
}

export interface LoginUser {
  email: string
  name: string
}

export interface HomeSnapshot {
  careStreak: string
  breathwork: string
  recentNote: string
  latestJournal: JournalEntry
  suggestedResource: ResourceItem
}

export interface AppState {
  moods: MoodEntry[]
  journalEntries: JournalEntry[]
  resources: ResourceItem[]
  chatMessages: ChatMessage[]
  profileSettings: ProfileSettings
  assessment: AssessmentState
  user: LoginUser
}
