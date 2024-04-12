import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LlmService } from '../llm/llm.service';
import { Book } from '@prisma/client';

const MAX_BOOK_RETRIEVAL_COUNT = 5;

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
  ) {}

  /**
   * 指定のクエリに対する書籍情報を取得する
   * @param query クエリ
   * @returns 書籍情報
   */
  async search(query: string): Promise<Book[]> {
    this.logger.debug(`BooksService.search called`, { query });
    // vector store
    const vectorStore = this.llmService.getBookVectorStore();
    // ベクトルデータから類似度が高い順に検索
    const result = await vectorStore.similaritySearch(
      query,
      MAX_BOOK_RETRIEVAL_COUNT,
    );
    console.debug(JSON.stringify(result, null, 2));
    const bookIds: string[] = result.map((result) => result.metadata.id);
    // 類似度が高い順に Book を取得
    const bookList: Book[] = [];
    for (const id of bookIds) {
      const book = await this.prisma.book.findUnique({
        where: {
          id,
        },
      });
      bookList.push(book);
    }
    this.logger.log(`ユーザーからの質問に応じた書籍情報を取得しました`, {
      query,
      bookList,
    });
    return bookList;
  }
}
