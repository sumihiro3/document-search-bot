import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';

const rawBodyBuffer = (req, res, buffer, encoding) => {
  // LINE Bot からの Webhook は署名検証を行うため、リクエストボディをそのまま使う
  if (!req.headers['x-line-signature']) {
    return;
  }
  if (buffer && buffer.length) {
    req.rawBody = buffer.toString(encoding || 'utf8');
  }
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // LINE Bot webhook のリクエスト（ヘッダーに x-line-signature が含まれる）は署名検証を行うため、リクエストボディをそのまま使う
  // それ以外のリクエストは、body-parser でパースする
  app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
  app.use(bodyParser.json({ verify: rawBodyBuffer }));

  await app.listen(3000);
}
bootstrap();
