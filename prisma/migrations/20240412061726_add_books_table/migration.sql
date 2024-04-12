-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "authors" TEXT[],
    "publisher" TEXT NOT NULL,
    "published_date" TIMESTAMP(3) NOT NULL,
    "isbn" TEXT NOT NULL,
    "item_url" TEXT NOT NULL,
    "page_count" INTEGER NOT NULL,
    "categories" TEXT[],
    "thumbnail" TEXT,
    "language" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "currency" TEXT,
    "vector" vector,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);
