import { Module } from '@nestjs/common';
import { LineBotService } from './line-bot.service';
import { BooksModule } from '../books/books.module';

@Module({
  providers: [LineBotService],
  imports: [BooksModule],
  exports: [LineBotService],
})
export class LineBotModule {}
