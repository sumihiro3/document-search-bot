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
  ],
  controllers: [
    AppController,
    MemoController,
    MoviesController,
    BooksController,
  ],
  providers: [AppService],
})
export class AppModule {}
