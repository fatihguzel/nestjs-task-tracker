import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignTodoDto {
  @ApiProperty()
  @IsString()
  userId: string;
}
