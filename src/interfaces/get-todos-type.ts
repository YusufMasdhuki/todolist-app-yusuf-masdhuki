export interface GetTodosParams {
  completed?: boolean; // filter status
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'; // filter prioritas
  dateGte?: string; // ISO format date
  dateLte?: string; // ISO format date
  page?: number; // default 1
  limit?: number; // default 10
  sort?: 'id' | 'title' | 'completed' | 'date' | 'priority';
  order?: 'asc' | 'desc'; // default asc
}

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  date: string; // ISO format
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface GetTodosResponse {
  todos: TodoItem[];
  totalTodos: number;
  hasNextPage: boolean;
  nextPage: number;
}
