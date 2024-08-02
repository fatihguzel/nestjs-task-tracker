import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entity/todo.entity';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), UserModule], // UserModule'i import ediyoruz
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}
