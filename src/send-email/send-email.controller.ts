import { Controller, Post, Body } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { SendEmailResponseDto } from './dto/send-email-response.dto';

@Controller()
export class SendEmailController {
  constructor(private readonly appService: SendEmailService) {}

  @Post('/send-email')
  async sendEmail(@Body() body: SendEmailDto): Promise<SendEmailResponseDto> {
    return await this.appService.sendEmail(body);
  }
}
