// Struktur data untuk setiap todo
export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  date: string; // ISO 8601 format
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

// Request query untuk infinite scroll
export interface GetTodosScrollParams {
  completed?: boolean; // filter todo yang completed atau belum
  nextCursor?: number; // index awal batch berikutnya
  limit?: number; // jumlah todos per request, default 10
  sort?: 'title' | 'date'; // field sort
  order?: 'asc' | 'desc'; // arah sort
}

// Response dari API
export interface GetTodosScrollResponse {
  todos: TodoItem[];
  nextCursor: number; // cursor untuk fetch berikutnya
  hasNextPage: boolean; // true jika masih ada data
}
