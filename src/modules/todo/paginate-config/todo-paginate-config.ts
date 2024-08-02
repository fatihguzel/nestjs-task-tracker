import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Todo } from '../entity/todo.entity';

export const TODO_PAGINATION_CONFIG: PaginateConfig<Todo> = {
  sortableColumns: ['createdAt', 'updatedAt'], // Sıralama yapabileceğiniz sütunlar
  relations: ['user'], // İlişkili veriler
  searchableColumns: ['title'], // Arama yapılabilecek sütunlar
  defaultSortBy: [
    ['createdAt', 'DESC'], // Varsayılan sıralama
    ['updatedAt', 'DESC'],
  ],
  maxLimit: 0, // Maksimum limit (0 = sınırsız)
  filterableColumns: {
    title: [FilterOperator.EQ, FilterOperator.CONTAINS], // Filtreleme yapabileceğiniz sütunlar ve operatörler
  },
};
