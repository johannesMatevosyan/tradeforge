import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class OrderIdParamDto {
  @ApiProperty({
    example: 'cmnxjaxs40000bwtzs7r5ip2m',
    description: 'Order id',
  })
  @IsString()
  @Length(10, 50)
  id!: string;
}
