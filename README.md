# Mindwell

A compassionate mental health companion app for daily reflection, mood tracking, and emotional wellbeing support.

## Features

- **Mood Tracking** - Track your daily moods with different tones (Tender, Restless, Grounded, Clear, Open)
- **Journal** - Write and store journal entries for self-reflection
- **AI Companion** - Chat with an AI-powered mental health companion (powered by Groq)
- **Assessment** - Take a mental health assessment with AI-generated insights
- **Profile Settings** - Customize reminders, journal lock, and privacy preferences
- **Care Streak** - Track your daily check-in streak
- **Resources** - Access wellness resources and suggestions

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI**: React 19, TypeScript, Framer Motion
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth v5 (JWT strategy)
- **AI**: Groq API (Llama 3.3 70B)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Groq API key (for AI features)

### Installation

1. Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd mental-health-ui
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```bash
AUTH_SECRET=your-random-secret-string
AUTH_PASSWORD=your-password
GROQ_API_KEY=your-groq-api-key
DATABASE_URL=postgresql://user:password@localhost:5432/mindwell
```

3. Initialize the database:

```bash
npx prisma generate
npx prisma db push
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Generate Prisma client and build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API route handlers
│   ├── about/             # About page
│   ├── assessment/        # Mental health assessment
│   ├── companion/         # AI chat companion
│   ├── journal/           # Journal entries
│   ├── login/             # Authentication
│   ├── mood/              # Mood tracking
│   ├── profile/           # User profile settings
│   ├── psychologists/     # Find psychologists
│   └── stress/            # Stress management resources
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components (NavBar)
│   └── pages/             # Page-specific components
├── lib/                   # Utility functions and services
│   ├── groq.ts            # Groq AI integration
│   ├── prisma.ts          # Prisma client
│   ├── session.ts         # Session management
│   └── store.ts           # Data access layer
├── prisma/                # Database schema and migrations
└── types/                 # TypeScript type definitions
```

## Database

The app uses PostgreSQL with Prisma ORM. The schema includes:

- `RegisteredUser` - User accounts with email/password auth
- `MoodEntry` - Daily mood records
- `JournalEntry` - Journal entries
- `ChatMessage` - AI companion chat history
- `UserAssessment` - Mental health assessment progress
- `ProfileSettings` - User preferences
