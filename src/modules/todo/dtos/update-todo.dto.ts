import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { CreateTodoDto } from './create-todo.dto';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
