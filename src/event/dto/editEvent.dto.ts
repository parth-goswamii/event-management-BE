import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditEventDto {
  @ApiProperty({
    example: 'Party',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsOptional()
  @IsString()
  event_name?: string;

  @ApiProperty({
    example: 'Birthday Party',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsOptional()
  @IsString()
  event_description?: string;
}
