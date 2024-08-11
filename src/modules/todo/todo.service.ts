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
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';

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

    const todoQuery = this.todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.users', 'users')
      .select([
        'todo.id',
        'todo.title',
        'todo.description',
        'todo.priority',
        'todo.startDate',
        'todo.endDate',
        'todo.status',
        'todo.completed',
        'todo.createdAt',
        'todo.updatedAt',
        'users.username',
        'users.role',
      ]);

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

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    this.logger.log('Creating a new todo');

    const users = await Promise.all(
      createTodoDto.users.map(async (userId) => {
        const user = await this.userRepository.findOneBy({
          id: String(userId),
        });
        if (!user) {
          this.logger.warn(`User with id ${userId} not found`);
          throw new CustomException('Kullanıcı bulunamadı', 404);
        }
        return user;
      }),
    );

    const newTodo = this.todoRepository.create({
      ...createTodoDto,
      users,
    });

    try {
      const savedTodo = await this.todoRepository.save(newTodo);
      this.logger.log('Created a new todo');
      return savedTodo;
    } catch (error) {
      this.logger.error('Error creating todo', error.stack);
      throw new CustomException(error.stack, 500);
    }
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    this.logger.log(`Updating todo with id: ${id}`);

    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      this.logger.warn(`Todo with id ${id} not found`);
      throw new CustomException('Görev bulunamadı', 404);
    }

    if (updateTodoDto.users) {
      const users = await Promise.all(
        updateTodoDto.users.map(async (userId) => {
          const user = await this.userRepository.findOneBy({
            id: String(userId),
          });
          if (!user) {
            this.logger.warn(`User with id ${userId} not found`);
            throw new CustomException('Kullanıcı bulunamadı', 404);
          }
          return user;
        }),
      );

      todo.users = [...users];
    }

    Object.assign(todo, updateTodoDto);

    await this.todoRepository.save(todo);

    this.logger.log(`Updated todo with id: ${id}`);

    return todo;
  }

  async assignUser(todoId: string, userId: string): Promise<Todo> {
    this.logger.log(`Assigning user ${userId} to todo ${todoId}`);

    const todo = await this.todoRepository.findOne({
      where: { id: todoId },
      relations: ['users'],
    });
    if (!todo) {
      this.logger.warn(`Todo with id ${todoId} not found`);
      throw new CustomException('Görev bulunamadı', 404);
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      this.logger.warn(`User with id ${userId} not found`);
      throw new CustomException('Kullanıcı bulunamadı', 404);
    }

    if (!todo.users.some((u) => u.id === userId)) {
      todo.users.push(user);
    }

    const updatedTodo = await this.todoRepository.save(todo);

    this.logger.log(`Assigned user ${userId} to todo ${todoId}`);

    return updatedTodo;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing todo with id: ${id}`);
    await this.todoRepository.delete(id);
    this.logger.log(`Removed todo with id: ${id}`);
  }
}
