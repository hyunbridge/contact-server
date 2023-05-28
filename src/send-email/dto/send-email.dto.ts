import { IsString } from 'class-validator';

export class SendEmailDto {
  @IsString()
  readonly subject: string;
  @IsString()
  readonly email: string;
  @IsString()
  readonly recaptcha_token: string;
}
