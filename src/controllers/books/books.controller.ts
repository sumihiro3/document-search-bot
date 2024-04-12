import { Controller, Get, Logger, Query } from '@nestjs/common';
import { BooksService } from 'src/services/books/books.service';

@Controller('books')
export class BooksController {
  private readonly logger = new Logger(BooksController.name);

  constructor(private readonly booksService: BooksService) {}

  @Get()
  async search(@Query('q') query?: string) {
    this.logger.debug('BooksController.search', { query });
    const result = this.booksService.search(query);
    this.logger.debug('search result', { result });
    return result;
  }
}
