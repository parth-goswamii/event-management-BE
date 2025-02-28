import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from 'src/libs/utils/constants/match.decorator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'Admin@123',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    example: 'Admin@1234',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(16)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$!%*()+,-./:;@[\]^_`'])[A-Za-z\d@$!*,-./:;<=>[\]^_`']{8,}$/,
    {
      message: 'Your password too weak',
    },
  )
  newPassword: string;

  @ApiProperty({
    example: 'Admin@1234',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @Match('newPassword', { message: 'Your confirm Password is not match.' })
  @IsNotEmpty()
  confirmPassword: string;
}
