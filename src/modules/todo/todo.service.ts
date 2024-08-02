import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entity/todo.entity';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { CustomLoggerService } from 'src/common/logger/custom-logger.service';
import { Paginate, PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { RelationColumn } from 'nestjs-paginate/lib/helper';
import { TODO_PAGINATION_CONFIG } from './paginate-config/todo-paginate-config';
import { User } from '../users/entity/user.entity';

@Injectable()
export class TodoService {
  private readonly logger = new CustomLoggerService();

  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(
    query: PaginateQuery,
    relations: RelationColumn<string>[] = [],
  ): Promise<Paginated<Todo>> {
    this.logger.log('Fetching all todos');

    // `PaginateQuery` nesnesini oluşturun
    const todoQuery = this.todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.user', 'user')
      .select(['todo', 'user.id', 'user.username'])
      .orderBy('todo.createdAt', 'DESC');

    // `Paginate` fonksiyonunu kullanarak sayfalama yapın
    const todos = await paginate(query, todoQuery, {
      ...TODO_PAGINATION_CONFIG,
      relations,
    });

    this.logger.log('Fetched all todos');

    return todos;
  }

  async findOne(id: string): Promise<Todo> {
    this.logger.log(`Fetching todo with id: ${id}`);
    const todo = await this.todoRepository.findOneBy({ id });

    if (!todo) {
      this.logger.warn(`Todo with id ${id} not found`);
      throw new CustomException('Görev bulunamadı', 404);
    }

    return todo;
  }

  async create(userId: string, todo: Partial<Todo>): Promise<Todo> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      this.logger.warn(`User with id ${userId} not found`);
      throw new CustomException('Kullanıcı bulunamadı', 404);
    }

    const newTodo = this.todoRepository.create({ ...todo, user });
    const savedTodo = await this.todoRepository.save(newTodo);

    return savedTodo;
  }

  async update(id: string, updatedTodo: Partial<Todo>): Promise<Todo> {
    this.logger.log(`Updating todo with id: ${id}`);
    await this.todoRepository.update(id, updatedTodo);
    const updated = await this.todoRepository.findOneBy({ id });

    if (!updated) {
      this.logger.warn(`Todo with id ${id} not found after update`);
      throw new CustomException('Görev bulunamadı', 404);
    }

    this.logger.log(`Updated todo with id: ${id}`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing todo with id: ${id}`);
    await this.todoRepository.delete(id);
    this.logger.log(`Removed todo with id: ${id}`);
  }
}
