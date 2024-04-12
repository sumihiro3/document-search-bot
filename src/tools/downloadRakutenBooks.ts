import axios, { AxiosError } from 'axios';
import { RakutenBooksResponse, RakutenBook } from '../types/rakuten-books';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { setTimeout } from 'timers/promises';

dotenv.config();

/**
 * API Base URL
 */
const RAKUTEN_BOOKS_API_BASE_URL =
  'https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404';

/**
 * 取得対象のジャンル
 */
const TARGET_GENRES = [
  // 001005003: インターネット・WEBデザイン
  '001005003',
  // 001005005: プログラミング
  '001005005',
];

/**
 * API クエリパラメータ
 */
const API_PARAMS = {
  applicationId: process.env.RAKUTEN_APPLICATION_ID,
  format: 'json',
  hits: 30,
};

/**
 * ファイル名
 */
const FILE_NAME = `data/books/rakuten_books.json`;

/**
 * 書籍データ
 */
const books: RakutenBook[] = [];

/**
 * ブックデータをダウンロードする
 */
async function main() {
  console.log('Download Rakuten Books API data...');
  for (const genre of TARGET_GENRES) {
    let page = 1;
    console.log(`Genre: ${genre}`);
    let response = await downloadBookData(genre, page);
    console.log(`Total pages: ${response.pageCount}`);
    console.debug(JSON.stringify(response, null, 2));
    // books に追加
    response.Items.map((i) => {
      addBook(i.Item);
    });
    await setTimeout(1000);
    while (page < response.pageCount) {
      page++;
      response = await downloadBookData(genre, page);
      response.Items.map((i) => {
        addBook(i.Item);
      });
      await setTimeout(1000);
    }
  }
  console.log(`Total books: ${books.length}`);
  const json = JSON.stringify(books, null, 2);
  fs.writeFileSync(FILE_NAME, json);
  console.log(`Save to ${FILE_NAME}`);
}

/**
 * 書籍データを追加する
 * @param book RakutenBook
 */
function addBook(book: RakutenBook) {
  const b = books.filter((b) => b.isbn === book.isbn);
  if (b.length > 0) {
    console.warn(`Duplicate ISBN: ${book.isbn}`);
    return;
  }
  books.push(book);
}

/**
 * 書籍データをダウンロードする
 * @param booksGenreId ジャンル
 * @param page ページ
 * @returns 書籍データ
 */
async function downloadBookData(
  booksGenreId: string,
  page: number,
): Promise<RakutenBooksResponse> {
  console.log(
    `Download Rakuten Books API data... Genre: ${booksGenreId} Page: ${page}`,
  );
  try {
    const params = { ...API_PARAMS, booksGenreId, page };
    const affiliateId = process.env.RAKUTEN_AFFILIATE_ID;
    if (affiliateId) {
      params['affiliateId'] = affiliateId;
    }
    // API を実行
    const response = await axios.get<RakutenBooksResponse>(
      RAKUTEN_BOOKS_API_BASE_URL,
      { params },
    );
    return response.data;
  } catch (error) {
    console.error(`Rakuten Books API の実行に失敗しました`);
    console.error(error);
    if (error instanceof AxiosError) {
      console.error(error.response?.data);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
