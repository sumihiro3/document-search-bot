import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LineBotSignatureGuard } from '../../guards/line-bot-signature.guard';
import {
  MessageEvent,
  TextEventMessage,
  WebhookEvent,
  WebhookRequestBody,
} from '@line/bot-sdk';
import { LineBotService } from '../../services/line-bot/line-bot.service';

@Controller('line-bot-webhook')
@ApiTags('Line Bot Webhook')
export class LineBotWebhookController {
  private readonly logger = new Logger(LineBotWebhookController.name);

  constructor(private readonly lineBotService: LineBotService) {}

  @Get()
  getHello(): string {
    return 'Hello LINE Bot!';
  }

  @Post()
  @UseGuards(LineBotSignatureGuard)
  async handleWebhook(@Body() req: WebhookRequestBody) {
    this.logger.debug('LineBotWebhookController.handleWebhook called', { req });
    const events = req.events;
    if (!events || events.length === 0) {
      return;
    }
    for await (const event of events) {
      await this.handleWebhookEvent(event);
    }
    // await this.booksService.downloadBooks();
  }

  /**
   * LINE Bot Webhook Event を処理する
   * @param event WebhookEvent
   */
  async handleWebhookEvent(event: WebhookEvent) {
    this.logger.debug('LineBotWebhookController.handleWebhookEvent called', {
      event,
    });
    const eventType = event.type;
    switch (eventType) {
      case 'message':
        await this.handleMessageEvent(event);
        break;
      default:
        // TODO: 未対応イベントの場合はエラーのメッセージを返す
        break;
    }
  }

  /**
   * Message Event を処理する
   * @param event WebhookEvent
   */
  async handleMessageEvent(event: MessageEvent) {
    this.logger.debug('LineBotWebhookController.handleMessageEvent called', {
      event,
    });
    const message = event.message;
    if (!message) {
      return;
    }
    const messageType = message.type;
    switch (messageType) {
      case 'text':
        await this.handleTextMessage(event, event.message as TextEventMessage);
        break;
      default:
        // TODO: 未対応メッセージの場合はエラーのメッセージを返す
        break;
    }
  }

  /**
   * Text Message の内容で書籍を検索して返信する
   * @param event MessageEvent
   */
  async handleTextMessage(event: MessageEvent, message: TextEventMessage) {
    this.logger.debug('LineBotWebhookController.handleTextMessage called', {
      event,
      message,
    });
    const text = message.text;
    if (!text) {
      return;
    }
    // 返信メッセージを作成して送信する
    await this.lineBotService.searchAndReplyRecommendBooks(event, message);
  }
}
