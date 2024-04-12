import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PrismaClient, Book, Prisma } from '@prisma/client';
import { RakutenBook } from '../types/rakuten-books';

const prisma = new PrismaClient();

/**
 * ベクター化してデータベースに登録する
 */
async function main() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const books: RakutenBook[] = require('../../data/books/rakuten_books.json');
  // vector store
  const vectorStore = getVectorStore();
  vectorStore.asRetriever();
  // add Books
  await vectorStore.addModels(
    await prisma.$transaction(
      books.map((rBook) => {
        const book = new RakutenBook(rBook).toEntity();
        return prisma.book.create({
          data: book,
        });
      }),
    ),
  );
  console.log('Books added');
}

/**
 * ベクターストアを取得する
 */
function getVectorStore() {
  return PrismaVectorStore.withModel<Book>(prisma).create(
    new OpenAIEmbeddings({
      batchSize: 512, // Default value if omitted is 512. Max is 2048
      modelName: 'text-embedding-3-small',
    }),
    {
      prisma: Prisma,
      tableName: 'Book',
      vectorColumnName: 'vector',
      columns: {
        id: PrismaVectorStore.IdColumn,
        title: PrismaVectorStore.ContentColumn,
        subtitle: PrismaVectorStore.ContentColumn,
        authors: PrismaVectorStore.ContentColumn,
        publisher: PrismaVectorStore.ContentColumn,
        description: PrismaVectorStore.ContentColumn,
      },
    },
  );
}

main().catch((e) => {
  throw e;
});
