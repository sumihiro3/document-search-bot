import axios, { AxiosError } from 'axios';
import { DiscoverMovieResult, MovieResult } from '../types/tmdb';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

import * as genres from '../../data/movies/genres.json';

dotenv.config();

/**
 * API キー
 */
const TMDB_API_KEY = process.env.TMDB_API_KEY;
/**
 * API ベース URL
 */
const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3/discover/movie';
/**
 * 取得対象のリリース年
 */
const TARGET_RELEASE_YEARS = [2022, 2023, 2024];
/**
 * APIパラメータ
 * @see https://developer.themoviedb.org/reference/discover-movie
 */
const API_PARAMS = {
  api_key: TMDB_API_KEY,
  language: 'ja',
  region: 'JP',
  watch_region: 'JP',
  sort_by: 'vote_average.desc',
  include_adult: false,
  include_video: false,
  'vote_count.gte': 50,
};

/**
 * ジャンル ID からジャンル名へのマッピング
 */
const MOVIE_GENRES = genres.genres.reduce((map, genre) => {
  map[genre.id] = genre.name;
  return map;
}, {});

/**
 * 映画データをダウンロードする
 */
async function main() {
  // API を実行する
  for (const year of TARGET_RELEASE_YEARS) {
    // 指定した年の映画データをダウンロード
    const movies = await downloadMovieDataByYear(API_PARAMS, year);
    // 映画データが有ればファイルに保存する
    if (movies.length > 0) {
      const fileName = `data/movies/movies_${year}.json`;
      console.log(`Save to ${fileName}`);
      const json = JSON.stringify(movies, null, 2);
      fs.writeFileSync(fileName, json);
    }
  }
}

/**
 * 指定した年の映画データをダウンロードする
 * @param params APIパラメーター
 */
async function downloadMovieDataByYear(
  params: Record<string, any>,
  year: number,
): Promise<MovieResult[]> {
  try {
    params['primary_release_year'] = year;
    const movies: MovieResult[] = [];
    let page = 1;
    // まずは1ページ目を取得
    const data = await discoverMovieData(params, page);
    let resultMovies = getMoviesFromDiscoverResult(data);
    // 取得した映画データを追加
    movies.push(...resultMovies);
    // 2ページ目以降がある場合は取得する
    if (data && data.total_pages > 1) {
      const maxPages = data.total_pages;
      console.log(`Total pages: ${maxPages}`);
      for (page = 2; page <= maxPages; page++) {
        const data = await discoverMovieData(params, page);
        if (data && data.results) {
          console.log(`Year: ${year} Page: ${page}`);
          console.log(data.results.map((movie: MovieResult) => movie.title));
          resultMovies = getMoviesFromDiscoverResult(data);
          // 取得した映画データを追加
          movies.push(...resultMovies);
        }
      }
    }
    console.log(`Total movies: ${movies.length}`);
    return movies;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function getMoviesFromDiscoverResult(result: DiscoverMovieResult) {
  const results = result.results;
  // movies
  const movies = results.map((result) => {
    const movie = { ...result };
    movie.genres = result.genre_ids.map((id) => MOVIE_GENRES[id]);
    movie.id = result.id.toString();
    return movie;
  });
  return movies;
}

/**
 * Discover API を実行して映画データを取得する
 * @see https://developer.themoviedb.org/reference/discover-movie
 * @param params API パラメーター
 * @param page ページ番号
 * @returns DiscoverMovieResult
 */
async function discoverMovieData(params: Record<string, any>, page: number) {
  console.log(`Discover page: ${page}`, { params });
  try {
    params.page = page;
    const response = await axios.get<DiscoverMovieResult>(TMDB_API_BASE_URL, {
      params,
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(`Discover API の実行に失敗しました`);
    console.error(error);
    if (error instanceof AxiosError) {
      console.error(error.response?.data);
    }
    throw error;
  }
}

// メイン処理実行
main().catch((e) => {
  throw e;
});
