import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Todo } from '../entity/todo.entity';

export const TODO_PAGINATION_CONFIG: PaginateConfig<Todo> = {
  sortableColumns: [
    'title',
    'description',
    'priority',
    'startDate',
    'endDate',
    'status',
    'completed',
    'createdAt',
  ],
  defaultSortBy: [['createdAt', 'DESC']],
  maxLimit: 100,
};
