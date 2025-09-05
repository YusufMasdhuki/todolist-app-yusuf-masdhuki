// components/todo-tab-content.tsx
'use client';

import { TodoCard } from '@/components/todo-card';
import { TodoSkeleton } from '@/components/todo-skeleton';

import { TodoItem } from '@/interfaces/get-todos-scroll-type';

type Props = {
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  todos: TodoItem[];
  localTodos: Record<string, boolean>;
  onToggle: (id: string) => void;
};

export function TodoTabContent({
  isLoading,
  isFetching,
  isSuccess,
  todos,
  localTodos,
  onToggle,
}: Props) {
  // ⏳ Masih loading awal / fetching pertama → tampilkan skeleton
  if (isLoading || (isFetching && todos.length === 0)) {
    return (
      <div className='space-y-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <TodoSkeleton key={i} />
        ))}
      </div>
    );
  }

  // ✅ Sudah sukses fetch, tidak fetching, dan data kosong → tampilkan empty state
  if (isSuccess && !isFetching && todos.length === 0) {
    return (
      <div className='rounded border p-4 text-center shadow'>
        Nothing to do yet!
      </div>
    );
  }

  // 📋 Data tersedia → tampilkan daftar todo
  return (
    <div className='flex flex-col gap-3'>
      {todos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          checked={localTodos[todo.id]}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
