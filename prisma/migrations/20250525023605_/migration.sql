/*
  Warnings:

  - You are about to drop the `SourcePlaylist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SourcePlaylist" DROP CONSTRAINT "SourcePlaylist_playlistId_fkey";

-- DropTable
DROP TABLE "SourcePlaylist";
