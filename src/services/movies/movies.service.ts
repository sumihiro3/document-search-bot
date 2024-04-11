import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LlmService } from '../llm/llm.service';
import { Movie } from '@prisma/client';

const MAX_MOVIE_RETRIEVAL_COUNT = 5;

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
  ) {}

  /**
   * 指定のクエリに対する映画情報を取得する
   * @param query クエリ
   * @returns 映画情報
   */
  async search(query: string): Promise<Movie[]> {
    this.logger.debug(`MoviesService.search called`, { query });
    // vector store
    const vectorStore = this.llmService.getMovieVectorStore();
    // ベクトルデータから類似度が高い順に検索
    const result = await vectorStore.similaritySearch(
      query,
      MAX_MOVIE_RETRIEVAL_COUNT,
    );
    console.debug(JSON.stringify(result, null, 2));
    const movieIds: string[] = result.map((result) => result.metadata.id);
    // 類似度が高い順に Movie を取得
    const movieList: Movie[] = [];
    for (const id of movieIds) {
      const movie = await this.prisma.movie.findUnique({
        where: {
          id,
        },
      });
      movieList.push(movie);
    }
    this.logger.log(`ユーザーからの質問に応じた映画情報を取得しました`, {
      query,
      movieList,
    });
    return movieList;
  }
}
