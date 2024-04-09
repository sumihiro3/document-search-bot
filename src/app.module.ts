import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemoModule } from './services/memo/memo.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { MemoController } from './controllers/memo/memo.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    MemoModule,
  ],
  controllers: [AppController, MemoController],
  providers: [AppService],
})
export class AppModule {}
