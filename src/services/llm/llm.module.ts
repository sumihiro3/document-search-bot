import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [LlmService],
  imports: [PrismaModule],
  exports: [LlmService],
})
export class LlmModule {}
