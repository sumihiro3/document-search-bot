import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VectorStore } from '@langchain/core/vectorstores';
import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Memo, Movie, Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { BaseRetriever } from '@langchain/core/retrievers';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import {
  PromptTemplate,
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  FewShotChatMessagePromptTemplate,
} from '@langchain/core/prompts';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { z } from 'zod';

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
   * LLM を取得する
   */
  getLlm(): BaseChatModel {
    return new ChatOpenAI({
      temperature: 0.85,
      modelName: 'gpt-4',
    });
  }

  getOutputParser() {
    const parser = StructuredOutputParser.fromZodSchema(
      z.object({
        answer: z
          .string()
          .describe(
            "answer to the user's question. Please omit the proposed film name. Please use a message that will help us enjoy the film.",
          ),
        titles: z
          .array(z.string())
          .describe(
            '提案する映画データのタイトル一覧。提案する映画が複数ある場合はすべて提案してください',
          ),
        ids: z
          .array(z.string())
          .describe(
            '提案する映画データの id 一覧。id は metadata.id の値です。提案する映画が複数ある場合はすべて提案してください',
          ),
      }),
    );
    return parser;
  }

  getMovieChatTemplate(): ChatPromptTemplate {
    const parser = this.getOutputParser();
    const prompt = new PromptTemplate({
      template: `
      コンテキストに沿ってユーザーの質問にあった映画を探して、日本語で回答してください。映画の候補が複数ある場合はすべて提案してください。
      ----------------
      {context}
      ----------------
      {format_instructions}
      `,
      inputVariables: ['context'],
      partialVariables: {
        format_instructions: parser.getFormatInstructions(),
      },
    });
    return ChatPromptTemplate.fromMessages([
      // ユーザーの質問に応じ、あった映画を探して、日本語で回答してください。映画の候補が複数ある場合はすべて提案してください。
      //   SystemMessagePromptTemplate.fromTemplate(`
      //   ユーザーの質問に応じて日本語で回答してください。映画名は含めないでIDだけ箇条書きにしてください。また、映画を楽しめるようなメッセージでお願いします。
      //   ----------------
      //   {context}
      // `),
      new SystemMessagePromptTemplate({ prompt }),
      HumanMessagePromptTemplate.fromTemplate(`{input}`),
    ]);
  }

  async movieRag(question: string): Promise<Movie[]> {
    const vectorStore = this.getMovieVectorStore();
    // const llm = this.getLlm();
    // const template = this.getMovieChatTemplate();
    // const documentChain = await createStuffDocumentsChain({
    //   prompt: template,
    //   llm,
    // });
    // const retrievalChain = await createRetrievalChain({
    //   retriever: vectorStore.asRetriever(MAX_MOVIE_RETRIEVAL),
    //   combineDocsChain: documentChain,
    // });
    // // retrievalChain.pipe(parser);
    // const result = await retrievalChain.invoke({ input: question });
    // console.log(result.answer);
    const movies = await vectorStore.similaritySearch(question, 5);
    console.log(JSON.stringify(movies, null, 2));
    const movieIds = movies.map((movie) => movie.metadata.id);
    const movieList: Movie[] = [];
    for (const id of movieIds) {
      const movie = await this.prismaService.movie.findUnique({
        where: {
          id,
        },
      });
      movieList.push(movie);
    }
    return movieList;
  }
}
