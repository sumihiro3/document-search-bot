import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const prisma = new PrismaClient();

async function main() {
  const memoList = await prisma.memo.findMany();

  const embeddings = new GoogleGenerativeAIEmbeddings();

  for (const memo of memoList) {
    // 文字列を適当な長さに分割する
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 20,
    });
    const documents = await splitter.createDocuments([memo.content]);
    const contents = documents.map(({ pageContent }) => pageContent);

    await Promise.all(
      contents.map(async (content) => {
        // Gemini API でベクトルデータ化する
        const vector = await embeddings.embedDocuments([content]);
        console.log({ content });
        // ベクトルデータを保存する
        return prisma.$executeRaw`
          INSERT INTO "MemoEmbedding" (
            "id",
            "memoId",
            "content",
            "vector"
          ) VALUES (
            DEFAULT,
            ${memo.id},
            ${content},
            ${`[${vector.join(',')}]`}::vector
          )
        `;
      }),
    );
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
