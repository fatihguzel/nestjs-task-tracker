import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Kullanıcı adı',
    example: 'john_doe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Kullanıcı şifresi',
    example: 'password123',
  })
  @IsString()
  password: string;
}
// Compare this snippet from src/modules/todo/todo.service.ts:
