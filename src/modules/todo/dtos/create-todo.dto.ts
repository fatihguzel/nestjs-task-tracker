import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, Length } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({
    description: 'Görevin başlığı',
    example: 'Buy groceries',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Görevin tamamlanıp tamamlanmadığı',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
