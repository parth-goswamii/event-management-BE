import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class EditServiceDto{
    @ApiProperty({
        example: 'Cake',
        type: 'string',
        format: 'string',
        required: true,
      })
      @IsString()
      @IsNotEmpty()
      service_name: string;
    
      @ApiProperty({
        example: 'Bakery Service',
        type: 'string',
        format: 'string',
        required: true,
      })
      @IsString()
      @IsNotEmpty()
      service_description: string;
    
      @ApiProperty({
        example: '4500',
        type: 'string',
        format: 'string',
        required: true,
      })
      @IsString()
      @IsNotEmpty()
      price: string;
}