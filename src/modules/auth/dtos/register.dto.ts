import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { AuthRole } from '../enums/auth-role.enum';

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

  @ApiProperty({
    description: 'Kullanıcı rolü',
    example: 'user',
    enum: AuthRole,
  })
  @IsString()
  role: string;
}
