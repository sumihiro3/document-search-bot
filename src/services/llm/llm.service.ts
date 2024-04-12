import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VectorStore } from '@langchain/core/vectorstores';
import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Book, Memo, Movie, Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LlmService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Memo model 用の VectorStore を取得する
   * @returns VectorStore
   */
  getMemoVectorStore(): VectorStore {
    const vectorStore = PrismaVectorStore.withModel<Memo>(
      this.prismaService,
    ).create(
      new OpenAIEmbeddings({
        modelName: this.configService.get('OPENAI_EMBEDDING_MODEL'),
      }),
      {
        prisma: Prisma,
        tableName: 'Memo',
        vectorColumnName: 'vector',
        columns: {
          id: PrismaVectorStore.IdColumn,
          content: PrismaVectorStore.ContentColumn,
        },
      },
    );
    return vectorStore;
  }

  /**
   * Movie model 用の VectorStore を取得する
   * @returns VectorStore
   */
  getMovieVectorStore(): VectorStore {
    const vectorStore = PrismaVectorStore.withModel<Movie>(
      this.prismaService,
    ).create(
      new OpenAIEmbeddings({
        modelName: this.configService.get('OPENAI_EMBEDDING_MODEL'),
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
    return vectorStore;
  }

  /**
   * Book model 用の VectorStore を取得する
   * @returns VectorStore
   */
  getBookVectorStore(): VectorStore {
    const vectorStore = PrismaVectorStore.withModel<Book>(
      this.prismaService,
    ).create(
      new OpenAIEmbeddings({
        modelName: this.configService.get('OPENAI_EMBEDDING_MODEL'),
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
    return vectorStore;
  }
}
