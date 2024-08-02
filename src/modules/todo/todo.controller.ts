import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './entity/todo.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
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

@ApiTags('todos')
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('')
  @ApiOperation({ summary: 'Tüm görevleri getir' })
  @ApiResponse({
    status: 200,
    description: 'Tüm görevler',
    type: Todo,
    isArray: true,
  })
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
  @ApiOperation({ summary: 'Bir görev getir' })
  @ApiResponse({ status: 200, description: 'Görev', type: Todo })
  async findOne(@Param('id') id: string): Promise<Todo> {
    return this.todoService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('')
  @ApiOperation({ summary: 'Yeni bir görev oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Görev oluşturuldu',
    type: Todo,
  })
  async create(
    @Req() req,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<Todo> {
    return this.todoService.create(req.user.id, createTodoDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Görevi güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Görev güncellendi',
    type: Todo,
  })
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todoService.update(id, updateTodoDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Görevi sil' })
  @ApiResponse({ status: 204, description: 'Görev silindi' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.todoService.remove(id);
  }
}
