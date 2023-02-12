import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({
    example: 'Alan',
    required: true,
  })
  name: string;

  @ApiProperty({
    example: 'alan@gmail.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: '63e93bb9c5ddd0b50a6cd313',
    required: true,
  })
  warehouse_id: string;
}
