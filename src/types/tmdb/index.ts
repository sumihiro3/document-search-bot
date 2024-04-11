import { Movie } from '@prisma/client';
import { toDate } from '../../utils/day.util';

/**
 * TMDB Discover movie API response
 */
export class DiscoverMovieResult {
  page: number;
  results: MovieResult[];
  total_pages: number;
  total_results: number;
}

/**
 * TMDB Movie API response
 */
export class MovieResult {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  genres?: string[];
  id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;

  /**
   * Convert to Movie entity
   * @param movie movie data
   * @returns Movie entity
   */
  static toEntity(movie: MovieResult): Movie {
    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      releaseDate: toDate(movie.release_date),
      genres: movie.genres,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      popularity: movie.popularity,
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
      originalLanguage: movie.original_language,
      originalTitle: movie.original_title,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static toTitle(movie: MovieResult): string {
    return `${movie.title} (${movie.release_date})`;
  }
}
