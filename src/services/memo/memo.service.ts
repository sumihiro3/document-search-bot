import { Injectable, Logger } from '@nestjs/common';
import { Memo } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LlmService } from '../llm/llm.service';

const MAX_MEMO_RETRIEVAL_COUNT = 5;

@Injectable()
export class MemoService {
  private readonly logger = new Logger(MemoService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
  ) {}

  async search(query: string): Promise<Memo[]> {
    this.logger.log(`search`, { query });
    // vector store
    const vectorStore = this.llmService.getMemoVectorStore();
    // ベクトルデータから類似度が高い順に検索
    const result = await vectorStore.similaritySearch(
      query,
      MAX_MEMO_RETRIEVAL_COUNT,
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
    this.logger.log(`ユーザーからの質問に応じたメモを取得しました`, {
      query,
      memoList,
    });
    return memoList;
  }
}
