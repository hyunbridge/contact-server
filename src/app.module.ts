import { Module } from '@nestjs/common';
import { SendEmailController } from './send-email/send-email.controller';
import { SendEmailService } from './send-email/send-email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
  ],
  controllers: [SendEmailController],
  providers: [SendEmailService],
})
export class AppModule {}
