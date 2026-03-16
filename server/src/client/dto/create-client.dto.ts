import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
