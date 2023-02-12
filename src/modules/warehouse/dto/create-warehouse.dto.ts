import { ApiProperty } from '@nestjs/swagger';

export class CreateWarehouseDto {
  
  @ApiProperty({
    example: 'Warehouse A',
    required: true,
  })
  name: string;

  @ApiProperty({
    example: '-3.87298',
    required: true,
  })
  latitude: string;

  @ApiProperty({
    example: '-38.66856',
    required: true,
  })
  longitude: string;

}
