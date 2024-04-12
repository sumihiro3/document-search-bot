import { Book } from '@prisma/client';

/**
 * Rakuten Books APIのレスポンス型
 */
export class RakutenBooksResponse {
  count: number;
  page: number;
  first: number;
  last: number;
  hits: number;
  carrier: number;
  pageCount: number;
  Items: RakutenBookItem[];
}

export class RakutenBookItem {
  Item: RakutenBook;
}

/**
 * Rakuten Books APIの書籍情報
 */
export class RakutenBook {
  constructor(b: RakutenBook) {
    this.title = b.title;
    this.titleKana = b.titleKana;
    this.subTitle = b.subTitle;
    this.subTitleKana = b.subTitleKana;
    this.seriesName = b.seriesName;
    this.seriesNameKana = b.seriesNameKana;
    this.contents = b.contents;
    this.contentsKana = b.contentsKana;
    this.author = b.author;
    this.authorKana = b.authorKana;
    this.publisherName = b.publisherName;
    this.size = b.size;
    this.isbn = b.isbn;
    this.itemCaption = b.itemCaption;
    this.itemPrice = b.itemPrice;
    this.listPrice = b.listPrice;
    this.itemUrl = b.itemUrl;
    this.affiliateUrl = b.affiliateUrl;
    this.smallImageUrl = b.smallImageUrl;
    this.mediumImageUrl = b.mediumImageUrl;
    this.largeImageUrl = b.largeImageUrl;
    this.booksGenreId = b.booksGenreId;
  }

  title: string;
  titleKana: string;
  subTitle: string;
  subTitleKana: string;
  seriesName: string;
  seriesNameKana: string;
  contents: string;
  contentsKana: string;
  author: string;
  authorKana: string;
  publisherName: string;
  size: string;
  isbn: string;
  itemCaption: string;
  itemPrice: number;
  listPrice: number;
  itemUrl: string;
  affiliateUrl?: string;
  smallImageUrl: string;
  mediumImageUrl: string;
  largeImageUrl: string;
  booksGenreId: string;

  /**
   * 書籍情報をエンティティに変換する
   * @returns Book
   */
  toEntity(): Book {
    return {
      id: this.isbn,
      title: this.title,
      subtitle: this.subTitle,
      authors: this.author ? [this.author] : [''],
      publishedDate: new Date(),
      publisher: this.publisherName,
      description: this.itemCaption,
      pageCount: 0,
      categories: [],
      thumbnail: this.largeImageUrl,
      isbn: this.isbn,
      itemUrl: this.affiliateUrl ? this.affiliateUrl : this.itemUrl,
      language: 'ja',
      price: this.itemPrice,
      currency: 'JPY',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
