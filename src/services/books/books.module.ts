import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { LlmModule } from '../llm/llm.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [BooksService],
  imports: [LlmModule, PrismaModule],
  exports: [BooksService],
})
export class BooksModule {}
