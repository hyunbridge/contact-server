import { Injectable, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as EmailValidator from 'email-validator';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './dto/send-email.dto';
import { SendEmailResponseDto } from './dto/send-email-response.dto';

@Injectable()
export class SendEmailService {
  constructor(private configService: ConfigService) {}

  async sendEmail(@Body() body: SendEmailDto): Promise<SendEmailResponseDto> {
    const RECAPTCHA_SECRET_KEY = this.configService.get<string>(
      'RECAPTCHA_SECRET_KEY',
    );
    const EMAIL_FROM_NAME = this.configService.get<string>('EMAIL_FROM_NAME');
    const EMAIL_FROM_MAIL = this.configService.get<string>('EMAIL_FROM_MAIL');
    const EMAIL_BODY = Buffer.from(
      this.configService.get<string>('EMAIL_BODY', ''),
      'base64',
    ).toString('utf8');
    const SMTP_HOST = this.configService.get<string>('SMTP_HOST');
    const SMTP_PORT = this.configService.get<number>('SMTP_PORT', 587);
    const SMTP_USERNAME = this.configService.get<string>('SMTP_USERNAME');
    const SMTP_PASSWORD = this.configService.get<string>('SMTP_PASSWORD');

    if (!EmailValidator.validate(body.email)) {
      throw new HttpException(
        'Please use a valid email.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const validation_result = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      undefined,
      {
        params: {
          secret: RECAPTCHA_SECRET_KEY,
          response: body.recaptcha_token,
        },
      },
    );
    if (!validation_result.data['success']) {
      throw new HttpException(
        'Recaptcha Validation Failed.',
        HttpStatus.FORBIDDEN,
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${EMAIL_FROM_NAME}" <${EMAIL_FROM_MAIL}>`,
      to: body.email,
      subject: body.subject,
      text: EMAIL_BODY,
    });

    return {
      statusCode: 200,
      message: 'Please check your inbox!',
    };
  }
}
