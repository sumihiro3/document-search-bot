import { Module } from '@nestjs/common';
import { MemoService } from './memo.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [MemoService],
  imports: [PrismaModule],
  exports: [MemoService],
})
export class MemoModule {}
