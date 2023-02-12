import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'fulano',
    required: true,
  })
  user_name: string;

  @ApiProperty({
    example: 'fulano@gmail.com',
    required: true,
  })
  email: string;

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
