import {
  MessageEvent,
  Message,
  TextEventMessage,
  FlexBubble,
} from '@line/bot-sdk';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BooksService } from '../books/books.service';
import { Book } from '@prisma/client';
import { messagingApi } from '@line/bot-sdk';
const { MessagingApiClient } = messagingApi;

@Injectable()
export class LineBotService {
  private readonly logger = new Logger(LineBotService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly booksService: BooksService,
  ) {}

  /**
   * MessagingApiClient を生成する
   * @return MessagingApiClient
   */
  createMessagingApiClient() {
    const channelAccessToken = this.configService.get<string>(
      'LINE_CHANNEL_ACCESS_TOKEN',
    );
    return new MessagingApiClient({ channelAccessToken });
  }

  /**
   * 応答メッセージを送る
   * @param event WebhookEvent
   * @param message 返信するメッセージ
   */
  async replyMessage(event: MessageEvent, replyMessages: Message[]) {
    this.logger.debug('LineBotService.replyMessage called', {
      event,
      replyMessages,
    });
    const replyToken = event.replyToken;
    if (!replyToken) {
      throw new BadRequestException('Reply token is missing');
    }
    const client = this.createMessagingApiClient();
    await client.replyMessage({
      replyToken,
      messages: replyMessages,
    });
  }

  /**
   * 質問に対応した書籍を検索して返信する
   * @param event MessageEvent
   * @param message TextEventMessage
   */
  async searchAndReplyRecommendBooks(
    event: MessageEvent,
    message: TextEventMessage,
  ): Promise<void> {
    this.logger.debug('LineBotService.searchBooks called', { message });
    // ローディングのアニメーションを表示する
    // @see https://developers.line.biz/ja/reference/messaging-api/#display-a-loading-indicator
    const client = this.createMessagingApiClient();
    await client.showLoadingAnimation({
      chatId: event.source.userId,
      loadingSeconds: 10,
    });
    // 検索
    const keyword = message.text;
    const books = await this.booksService.search(keyword);
    let messages: Message[] = [];
    if (books.length === 0) {
      messages = [
        { type: 'text', text: '質問に適した書籍が見つかりませんでした' },
      ];
    } else {
      // メッセージに変換
      const flexMessages = books.map((book) => this.toFlexBubble(book));
      messages = [
        {
          type: 'flex',
          altText: '書籍情報',
          contents: {
            type: 'carousel',
            contents: flexMessages,
          },
        },
      ];
    }
    // 返信
    return await this.replyMessage(event, messages);
  }

  /**
   * Book を FlexBubble に変換する
   * @param book Book
   * @return FlexBubble[]
   */
  toFlexBubble(book: Book): FlexBubble {
    const author = book.authors.join(', ');
    // 本の情報を Flex Message に変換する
    const flexMessageStr = `
    {
      "type": "bubble",
      "hero": {
        "type": "image",
        "url": "${book.thumbnail}",
        "size": "xxl",
        "aspectRatio": "14:20",
        "aspectMode": "cover",
        "action": {
          "type": "uri",
          "uri": "${book.itemUrl}"
        }
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "${book.title}",
            "weight": "bold",
            "size": "lg",
            "wrap": true
          },
          {
            "type": "box",
            "layout": "vertical",
            "margin": "lg",
            "spacing": "sm",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "著者",
                    "color": "#aaaaaa",
                    "size": "sm",
                    "flex": 1
                  },
                  {
                    "type": "text",
                    "text": "${author}",
                    "wrap": true,
                    "color": "#666666",
                    "size": "sm",
                    "flex": 5
                  }
                ]
              },
              {
                "type": "box",
                "layout": "baseline",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "出版社",
                    "color": "#aaaaaa",
                    "size": "sm",
                    "flex": 1
                  },
                  {
                    "type": "text",
                    "text": "${book.publisher}",
                    "wrap": true,
                    "color": "#666666",
                    "size": "sm",
                    "flex": 5
                  }
                ]
              },
              {
                "type": "box",
                "layout": "baseline",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "価格",
                    "color": "#aaaaaa",
                    "size": "sm",
                    "flex": 1
                  },
                  {
                    "type": "text",
                    "text": "${book.price} 円",
                    "wrap": true,
                    "color": "#666666",
                    "size": "sm",
                    "flex": 5
                  }
                ]
              }
            ]
          }
        ]
      },
      "footer": {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "contents": [
          {
            "type": "button",
            "style": "link",
            "height": "sm",
            "action": {
              "type": "uri",
              "label": "詳細を見る",
              "uri": "${book.itemUrl}"
            }
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [],
            "margin": "sm"
          }
        ],
        "flex": 0
      }
    }`;
    return JSON.parse(flexMessageStr);
  }
}
