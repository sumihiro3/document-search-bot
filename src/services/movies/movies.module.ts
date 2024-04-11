import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { LlmModule } from '../llm/llm.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [MoviesService],
  imports: [LlmModule, PrismaModule],
  exports: [MoviesService],
})
export class MoviesModule {}
