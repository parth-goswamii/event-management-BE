import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from 'src/libs/utils/constants/match.decorator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'parthgoswami.shivinfotech@gmail.com',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 123456,
    type: 'number',
    format: 'number',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  otp: string;

  @ApiProperty({
    example: 'Admin@123',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$!%*#(+,-./:;<=@[\]^_`'])[A-Za-z\d@$!%?#(*+,-./:;<=[\]^_`]{8,}$/,
    {
      message: 'Your password is too weak',
    },
  )
  newPassword: string;

  @ApiProperty({
    example: 'Admin@123',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Match('newPassword', { message: 'Your confirm Password is not match.' })
  confirmPassword: string;
}

export class VerifyEmailDto {
  @ApiProperty({
    example: 'parthgoswami.shivinfotech@gmail.com',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
