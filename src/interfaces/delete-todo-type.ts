// Response untuk DELETE /todos/{id}
export interface DeleteTodoResponse {
  id: string;
  title: string;
  completed: boolean;
  date: string; // ISO 8601 format
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}
