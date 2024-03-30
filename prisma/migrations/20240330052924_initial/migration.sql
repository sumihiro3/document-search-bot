-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "Memo" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Memo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoEmbedding" (
    "id" SERIAL NOT NULL,
    "memoId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "vector" vector NOT NULL,

    CONSTRAINT "MemoEmbedding_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemoEmbedding" ADD CONSTRAINT "MemoEmbedding_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "Memo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
