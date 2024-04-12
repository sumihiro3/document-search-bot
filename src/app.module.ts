import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemoModule } from './services/memo/memo.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { MemoController } from './controllers/memo/memo.controller';
import { ConfigModule } from '@nestjs/config';
import { MoviesController } from './controllers/movies/movies.controller';
import { MoviesModule } from './services/movies/movies.module';
import { LlmModule } from './services/llm/llm.module';
import { BooksModule } from './services/books/books.module';
import { BooksController } from './controllers/books/books.controller';
import { LineBotWebhookController } from './controllers/line-bot-webhook/line-bot-webhook.controller';
import { LineBotModule } from './services/line-bot/line-bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    MemoModule,
    MoviesModule,
    LlmModule,
    BooksModule,
    LineBotModule,
  ],
  controllers: [
    AppController,
    MemoController,
    MoviesController,
    BooksController,
    LineBotWebhookController,
  ],
  providers: [AppService],
})
export class AppModule {}
