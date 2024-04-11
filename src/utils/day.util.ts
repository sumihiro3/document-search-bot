import * as dayjs from 'dayjs';

/**
 * 文字列を日付型に変換する
 * @param str 日付文字列
 */
export function toDate(str: string): Date {
  return dayjs(str).toDate();
}
