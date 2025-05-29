-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "sourcePlaylistId" TEXT;

-- CreateIndex
CREATE INDEX "Playlist_sourcePlaylistId_idx" ON "Playlist"("sourcePlaylistId");

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_sourcePlaylistId_fkey" FOREIGN KEY ("sourcePlaylistId") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
