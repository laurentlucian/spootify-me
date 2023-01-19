-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LikedSongs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "likedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trackId" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "albumUri" TEXT,
    "albumName" TEXT,
    "artist" TEXT NOT NULL,
    "artistUri" TEXT,
    "explicit" BOOLEAN NOT NULL,
    "preview_url" TEXT DEFAULT '',
    "link" TEXT NOT NULL DEFAULT '',
    "duration" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT,
    "action" TEXT NOT NULL DEFAULT 'liked',
    CONSTRAINT "LikedSongs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile" ("userId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LikedSongs_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LikedSongs" ("action", "albumName", "albumUri", "artist", "artistUri", "duration", "explicit", "id", "image", "likedAt", "link", "name", "preview_url", "trackId", "uri", "userId") SELECT "action", "albumName", "albumUri", "artist", "artistUri", "duration", "explicit", "id", "image", "likedAt", "link", "name", "preview_url", "trackId", "uri", "userId" FROM "LikedSongs";
DROP TABLE "LikedSongs";
ALTER TABLE "new_LikedSongs" RENAME TO "LikedSongs";
CREATE UNIQUE INDEX "LikedSongs_trackId_userId_key" ON "LikedSongs"("trackId", "userId");
CREATE TABLE "new_RecentSongs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trackId" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "albumUri" TEXT,
    "albumName" TEXT,
    "artist" TEXT NOT NULL,
    "artistUri" TEXT,
    "explicit" BOOLEAN NOT NULL,
    "preview_url" TEXT DEFAULT '',
    "link" TEXT NOT NULL DEFAULT '',
    "duration" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL DEFAULT 'recent',
    CONSTRAINT "RecentSongs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RecentSongs_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RecentSongs" ("action", "albumName", "albumUri", "artist", "artistUri", "duration", "explicit", "id", "image", "link", "name", "playedAt", "preview_url", "trackId", "uri", "userId") SELECT "action", "albumName", "albumUri", "artist", "artistUri", "duration", "explicit", "id", "image", "link", "name", "playedAt", "preview_url", "trackId", "uri", "userId" FROM "RecentSongs";
DROP TABLE "RecentSongs";
ALTER TABLE "new_RecentSongs" RENAME TO "RecentSongs";
CREATE UNIQUE INDEX "RecentSongs_playedAt_userId_key" ON "RecentSongs"("playedAt", "userId");
CREATE TABLE "new_Track" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uri" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "albumUri" TEXT NOT NULL,
    "albumName" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "artistUri" TEXT NOT NULL,
    "explicit" BOOLEAN NOT NULL,
    "preview_url" TEXT DEFAULT '',
    "link" TEXT NOT NULL DEFAULT '',
    "duration" INTEGER NOT NULL
);
INSERT INTO "new_Track" ("albumName", "albumUri", "artist", "artistUri", "duration", "explicit", "id", "image", "link", "name", "preview_url", "uri") SELECT "albumName", "albumUri", "artist", "artistUri", "duration", "explicit", "id", "image", "link", "name", "preview_url", "uri" FROM "Track";
DROP TABLE "Track";
ALTER TABLE "new_Track" RENAME TO "Track";
CREATE UNIQUE INDEX "Track_id_key" ON "Track"("id");
CREATE TABLE "new_Queue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ownerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pending" BOOLEAN NOT NULL DEFAULT false,
    "trackId" TEXT,
    "uri" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "albumUri" TEXT,
    "albumName" TEXT,
    "artist" TEXT NOT NULL,
    "artistUri" TEXT,
    "explicit" BOOLEAN NOT NULL,
    "preview_url" TEXT DEFAULT '',
    "link" TEXT NOT NULL DEFAULT '',
    "duration" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT,
    "action" TEXT NOT NULL DEFAULT 'add',
    CONSTRAINT "Queue_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Queue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile" ("userId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Queue_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Queue" ("action", "albumName", "albumUri", "artist", "artistUri", "createdAt", "duration", "explicit", "id", "image", "name", "ownerId", "pending", "trackId", "uri", "userId") SELECT "action", "albumName", "albumUri", "artist", "artistUri", "createdAt", "duration", "explicit", "id", "image", "name", "ownerId", "pending", "trackId", "uri", "userId" FROM "Queue";
DROP TABLE "Queue";
ALTER TABLE "new_Queue" RENAME TO "Queue";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
