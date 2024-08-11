import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './entity/todo.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate';
import { RelationDecorator } from 'nestjs-paginate-relations-filter-middleware';
import { TODO_PAGINATION_CONFIG } from './paginate-config/todo-paginate-config';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { AssignTodoDto } from './dtos/assign-todo.dto';

@ApiTags('todos')
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('')
  @ApiPaginationQuery(TODO_PAGINATION_CONFIG)
  async findAll(
    @Paginate() query: PaginateQuery,
    @RelationDecorator() relation: any,
  ): Promise<Paginated<Todo>> {
    return this.todoService.findAll(query, relation);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Todo> {
    return this.todoService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('')
  async create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todoService.create(createTodoDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todoService.update(id, updateTodoDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/assign')
  async assign(
    @Param('id') id: string,
    @Body() body: AssignTodoDto,
  ): Promise<Todo> {
    return this.todoService.assignUser(id, body.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.todoService.remove(id);
  }
}
