/*
  Warnings:

  - You are about to drop the column `type` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `platform` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `platformId` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `Track` table. All the data in the column will be lost.
  - Added the required column `artist` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_playlistId_fkey";

-- DropIndex
DROP INDEX "Track_platform_platformId_key";

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "type",
DROP COLUMN "value";

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "platform",
DROP COLUMN "platformId",
DROP COLUMN "playlistId",
ADD COLUMN     "album" TEXT,
ADD COLUMN     "artist" TEXT NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TrackPlatform" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "platformId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackPlatform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistTrack" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaylistTrack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrackPlatform_trackId_idx" ON "TrackPlatform"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackPlatform_platform_platformId_key" ON "TrackPlatform"("platform", "platformId");

-- CreateIndex
CREATE INDEX "PlaylistTrack_playlistId_idx" ON "PlaylistTrack"("playlistId");

-- CreateIndex
CREATE INDEX "PlaylistTrack_trackId_idx" ON "PlaylistTrack"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistTrack_playlistId_trackId_key" ON "PlaylistTrack"("playlistId", "trackId");

-- CreateIndex
CREATE INDEX "Playlist_userId_idx" ON "Playlist"("userId");

-- AddForeignKey
ALTER TABLE "TrackPlatform" ADD CONSTRAINT "TrackPlatform_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistTrack" ADD CONSTRAINT "PlaylistTrack_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistTrack" ADD CONSTRAINT "PlaylistTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
