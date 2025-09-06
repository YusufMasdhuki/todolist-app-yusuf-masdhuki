import { TodoItem } from './get-todos-scroll-type';

export interface TodoState {
  todos: TodoItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  selectedDate: string;
  filter: {
    completed?: boolean;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    keyword?: string;
    dateGte?: string;
    dateLte?: string;
  };
  page: number;
  hasNextPage: boolean;
  isAddTaskOpen: boolean;
  isDateFiltered: boolean; // ⬅️ baru
  addTaskForm: {
    title: string;
    date: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
  };
}
