import { Injectable, Logger } from '@nestjs/common';
import { Memo, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma';
import { OpenAIEmbeddings } from '@langchain/openai';

@Injectable()
export class MemoService {
  private readonly logger = new Logger(MemoService.name);

  private readonly maxSearchResults = 5;

  constructor(private readonly prisma: PrismaService) {}

  async search(query: string): Promise<Memo[]> {
    this.logger.log(`search`, { query });
    // vector store
    const vectorStore = PrismaVectorStore.withModel<Memo>(this.prisma).create(
      new OpenAIEmbeddings({
        modelName: 'text-embedding-3-small',
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
    // ベクトルデータから類似度が高い順に検索
    const result = await vectorStore.similaritySearch(
      query,
      this.maxSearchResults,
    );
    console.log(JSON.stringify(result, null, 2));
    const memoIds: number[] = result.map((result) => result.metadata.id);
    // 類似度が高い順にメモを取得
    const memoList: Memo[] = [];
    for (const id of memoIds) {
      const memo = await this.prisma.memo.findUnique({
        where: {
          id,
        },
      });
      memoList.push(memo);
    }
    return memoList;
  }
}
