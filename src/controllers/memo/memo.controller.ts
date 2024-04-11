import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Memo } from '@prisma/client';
import { MemoService } from 'src/services/memo/memo.service';

@Controller('memo')
@ApiTags('Memo')
export class MemoController {
  private readonly logger = new Logger(MemoController.name);

  constructor(private readonly memoService: MemoService) {}

  @Get()
  async search(@Query('q') query?: string): Promise<Memo[]> {
    this.logger.debug('search', { query });
    const result = await this.memoService.search(query);
    this.logger.debug('search result', { result });
    return result;
  }
}
