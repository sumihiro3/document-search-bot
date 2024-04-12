import { Controller, Get, Logger, Query } from '@nestjs/common';
import { MoviesService } from '../../services/movies/movies.service';

@Controller('movies')
export class MoviesController {
  private readonly logger = new Logger(MoviesController.name);

  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async search(@Query('q') query?: string) {
    this.logger.debug('MoviesController.search', { query });
    const result = this.moviesService.search(query);
    this.logger.debug('search result', { result });
    return result;
  }
}
