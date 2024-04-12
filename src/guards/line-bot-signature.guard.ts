import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  RawBodyRequest,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { createHmac } from 'crypto';

@Injectable()
export class LineBotSignatureGuard implements CanActivate {
  private readonly logger = new Logger(LineBotSignatureGuard.name);

  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.debug('LineBotSignatureGuard.canActivate called');
    const req = context.switchToHttp().getRequest<RawBodyRequest<Request>>();
    // リクエストヘッダーから署名を取得する
    const signature = req.headers['x-line-signature'];
    if (!signature) {
      this.logger.error('Signature is missing');
      return false;
    }
    // チャンネルシークレットを取得する
    const channelSecret = this.configService.get<string>('LINE_CHANNEL_SECRET');
    if (!channelSecret) {
      this.logger.error('Channel secret is missing');
      return false;
    }
    // リクエストボディのダイジェストを計算する
    const body = req.rawBody;
    this.logger.debug('Request body', { body });
    const sign = createHmac('SHA256', channelSecret)
      .update(body)
      .digest('base64');
    // リクエストヘッダーのx-line-signatureに含まれる署名と一致するか確認する
    if (signature !== sign) {
      this.logger.error('Signature is invalid');
      return false;
    }
    return true;
  }
}
