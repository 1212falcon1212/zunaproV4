import { IsEmail, IsString } from 'class-validator';

export class StorefrontLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
