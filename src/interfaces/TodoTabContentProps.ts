import { TodoItem } from './get-todos-scroll-type';

export type TodoTabContentProps = {
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  todos: TodoItem[];
  localTodos: Record<string, boolean>;
  onToggle: (id: string) => void;
  fetchNextPage?: () => void; // untuk infinite scroll
  hasNextPage?: boolean;
  searchTerm?: string; // opsional
};
