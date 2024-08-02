import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { CreateTodoDto } from './create-todo.dto';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ApiProperty({
    description: 'Todonun kimliği',
    example: 1,
  })
  @IsString()
  id: string;

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
