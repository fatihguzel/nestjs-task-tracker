import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterDto {
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

  @ApiProperty({
    description: 'Kullanıcı şifresi tekrarı',
    example: 'password123',
  })
  @IsString()
  passwordConfirmation: string;
}
// Compare this snippet from src/modules/todo/todo.service.ts:
