import { MovieResult } from '../types/tmdb';
import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PrismaClient, Movie, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 取得対象のリリース年
 */
const TARGET_RELEASE_YEARS = [2022, 2023, 2024];

async function main() {
  const movies: MovieResult[] = [];
  for (const year of TARGET_RELEASE_YEARS) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const movieList: MovieResult[] = require(`../../data/movies/movies_${year}.json`);
    movies.push(...movieList);
  }
  // vector store
  const vectorStore = getVectorStore();
  vectorStore.asRetriever();
  // add Movies
  await vectorStore.addModels(
    await prisma.$transaction(
      movies.map((movie) => {
        return prisma.movie.create({
          data: MovieResult.toEntity(movie),
        });
      }),
    ),
  );
  console.log('Movies added');
}

function getVectorStore() {
  return PrismaVectorStore.withModel<Movie>(prisma).create(
    new OpenAIEmbeddings({
      batchSize: 512, // Default value if omitted is 512. Max is 2048
      modelName: 'text-embedding-3-small',
    }),
    {
      prisma: Prisma,
      tableName: 'Movie',
      vectorColumnName: 'vector',
      columns: {
        id: PrismaVectorStore.IdColumn,
        title: PrismaVectorStore.ContentColumn,
        overview: PrismaVectorStore.ContentColumn,
        genres: PrismaVectorStore.ContentColumn,
      },
    },
  );
}

main().catch((e) => {
  throw e;
});
