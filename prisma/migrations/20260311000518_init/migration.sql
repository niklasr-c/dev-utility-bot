-- CreateTable
CREATE TABLE "CommandStat" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);
