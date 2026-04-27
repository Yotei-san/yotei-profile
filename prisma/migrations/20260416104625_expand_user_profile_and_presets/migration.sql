/*
  Warnings:

  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "aboutText" TEXT,
ADD COLUMN     "aboutTitle" TEXT,
ADD COLUMN     "avatarPosition" TEXT DEFAULT 'center',
ADD COLUMN     "backgroundStyle" TEXT DEFAULT 'gradient',
ADD COLUMN     "backgroundUrl" TEXT,
ADD COLUMN     "badge1" TEXT,
ADD COLUMN     "badge2" TEXT,
ADD COLUMN     "badge3" TEXT,
ADD COLUMN     "buttonStyle" TEXT DEFAULT 'solid',
ADD COLUMN     "cardBlur" INTEGER DEFAULT 16,
ADD COLUMN     "cardOpacity" INTEGER DEFAULT 72,
ADD COLUMN     "containerWidth" TEXT DEFAULT 'normal',
ADD COLUMN     "discordUrl" TEXT,
ADD COLUMN     "gallery1" TEXT,
ADD COLUMN     "gallery2" TEXT,
ADD COLUMN     "gallery3" TEXT,
ADD COLUMN     "gallery4" TEXT,
ADD COLUMN     "gallery5" TEXT,
ADD COLUMN     "gallery6" TEXT,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "glowIntensity" INTEGER DEFAULT 35,
ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "layoutStyle" TEXT DEFAULT 'stacked',
ADD COLUMN     "linksStyle" TEXT DEFAULT 'rounded',
ADD COLUMN     "musicArtist" TEXT,
ADD COLUMN     "musicCoverUrl" TEXT,
ADD COLUMN     "musicTitle" TEXT,
ADD COLUMN     "musicUrl" TEXT,
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "premiumBadge" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "premiumSince" TIMESTAMP(3),
ADD COLUMN     "premiumUntil" TIMESTAMP(3),
ADD COLUMN     "presetTheme" TEXT DEFAULT 'custom',
ADD COLUMN     "showAbout" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showGallery" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showMusic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showReactions" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showSocials" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showStats" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "stat1Label" TEXT,
ADD COLUMN     "stat1Value" TEXT,
ADD COLUMN     "stat2Label" TEXT,
ADD COLUMN     "stat2Value" TEXT,
ADD COLUMN     "stat3Label" TEXT,
ADD COLUMN     "stat3Value" TEXT,
ADD COLUMN     "stripePriceId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT,
ADD COLUMN     "subscriptionStatus" TEXT,
ADD COLUMN     "textColor" TEXT,
ADD COLUMN     "tiktokUrl" TEXT,
ADD COLUMN     "videoBgUrl" TEXT,
ADD COLUMN     "websiteUrl" TEXT,
ADD COLUMN     "xUrl" TEXT,
ADD COLUMN     "youtubeUrl" TEXT;

-- CreateTable
CREATE TABLE "Preset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "themeColor" TEXT,
    "textColor" TEXT,
    "cardOpacity" INTEGER,
    "cardBlur" INTEGER,
    "backgroundStyle" TEXT,
    "buttonStyle" TEXT,
    "glowIntensity" INTEGER,
    "presetTheme" TEXT,
    "layoutStyle" TEXT,
    "containerWidth" TEXT,
    "avatarPosition" TEXT,
    "linksStyle" TEXT,
    "blocksOrder" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Preset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Preset_userId_createdAt_idx" ON "Preset"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeSubscriptionId_key" ON "User"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "User_plan_idx" ON "User"("plan");

-- CreateIndex
CREATE INDEX "User_stripeCustomerId_idx" ON "User"("stripeCustomerId");

-- AddForeignKey
ALTER TABLE "Preset" ADD CONSTRAINT "Preset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
