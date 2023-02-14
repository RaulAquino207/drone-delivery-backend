import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
  @ApiProperty({
    example: '63e97a4aa91d9e437e9484e9',
    required: true,
  })
  user_id: string;

  @ApiProperty({
    example: '63e97a4aa91d9e437e9484e9',
    required: true,
  })
  section_id: string;
}
