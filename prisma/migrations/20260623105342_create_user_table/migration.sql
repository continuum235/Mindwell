-- CreateTable
CREATE TABLE "GlobalState" (
    "id" TEXT NOT NULL DEFAULT 'mindwell-state',
    "moods" JSONB NOT NULL DEFAULT '[]',
    "journalEntries" JSONB NOT NULL DEFAULT '[]',
    "resources" JSONB NOT NULL DEFAULT '[]',
    "chatMessages" JSONB NOT NULL DEFAULT '[]',
    "profileSettings" JSONB NOT NULL DEFAULT '{}',
    "assessment" JSONB NOT NULL DEFAULT '{}',
    "user" JSONB NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegisteredUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegisteredUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoodEntry" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoodEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAssessment" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "currentQuestionIndex" INTEGER NOT NULL DEFAULT 0,
    "answers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "resultMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileSettings" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dailyReminder" BOOLEAN NOT NULL DEFAULT true,
    "journalLock" BOOLEAN NOT NULL DEFAULT false,
    "anonymousInsights" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegisteredUser_email_key" ON "RegisteredUser"("email");

-- CreateIndex
CREATE INDEX "MoodEntry_email_day_idx" ON "MoodEntry"("email", "day");

-- CreateIndex
CREATE INDEX "JournalEntry_email_idx" ON "JournalEntry"("email");

-- CreateIndex
CREATE INDEX "ChatMessage_email_idx" ON "ChatMessage"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserAssessment_email_key" ON "UserAssessment"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileSettings_email_key" ON "ProfileSettings"("email");

-- AddForeignKey
ALTER TABLE "MoodEntry" ADD CONSTRAINT "MoodEntry_email_fkey" FOREIGN KEY ("email") REFERENCES "RegisteredUser"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_email_fkey" FOREIGN KEY ("email") REFERENCES "RegisteredUser"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_email_fkey" FOREIGN KEY ("email") REFERENCES "RegisteredUser"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssessment" ADD CONSTRAINT "UserAssessment_email_fkey" FOREIGN KEY ("email") REFERENCES "RegisteredUser"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileSettings" ADD CONSTRAINT "ProfileSettings_email_fkey" FOREIGN KEY ("email") REFERENCES "RegisteredUser"("email") ON DELETE CASCADE ON UPDATE CASCADE;
