export interface CreateTodoRequest {
  title: string;
  completed: boolean;
  date: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface TodoResponse {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}
