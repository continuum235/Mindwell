# Mindwell

This project has been migrated from Vite React to Next.js with the App Router. The UI remains the same, but app data now flows through backend route handlers with MongoDB persistence.

## Stack

- Next.js
- React
- TypeScript
- Framer Motion
- MongoDB

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and set `MONGODB_URI`.

3. Start the app:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Environment

```bash
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=mindwell
```

If `MONGODB_URI` is not set, the app falls back to an in-memory store so the UI still runs, but persistence will reset on restart.
