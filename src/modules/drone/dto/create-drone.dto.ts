import { ApiProperty } from '@nestjs/swagger';

export class CreateDroneDto {
  @ApiProperty({
    example: 20,
    required: true,
  })
  speed: number;

  @ApiProperty({
    example: '63e93bb9c5ddd0b50a6cd313',
    required: true,
  })
  warehouse_id: string;
}
