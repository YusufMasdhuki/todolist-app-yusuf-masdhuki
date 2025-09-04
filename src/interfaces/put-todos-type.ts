// Request body untuk update todo
export interface UpdateTodoRequest {
  title: string;
  completed: boolean;
  date: string; // ISO 8601 format, contoh: "2025-09-03T08:07:28.152Z"
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

// Response body setelah todo berhasil diupdate
export interface UpdateTodoResponse {
  id: string;
  title: string;
  completed: boolean;
  date: string; // ISO 8601 format
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}
