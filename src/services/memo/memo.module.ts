import { Module } from '@nestjs/common';
import { MemoService } from './memo.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LlmModule } from '../llm/llm.module';

@Module({
  providers: [MemoService],
  imports: [PrismaModule, LlmModule],
  exports: [MemoService],
})
export class MemoModule {}
