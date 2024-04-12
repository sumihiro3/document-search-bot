import { Test, TestingModule } from '@nestjs/testing';
import { LineBotWebhookController } from './line-bot-webhook.controller';

describe('LineBotWebhookController', () => {
  let controller: LineBotWebhookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineBotWebhookController],
    }).compile();

    controller = module.get<LineBotWebhookController>(LineBotWebhookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
