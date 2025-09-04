// components/todo-tab-content.tsx
'use client';

import { TodoCard } from '@/components/todo-card';
import { TodoSkeleton } from '@/components/todo-skeleton';

type Props = {
  isLoading: boolean;
  showEmpty: boolean;
  todos: any[];
  localTodos: Record<string, boolean>;
  onToggle: (id: string) => void;
  emptyLabel: string;
};

export function TodoTabContent({
  isLoading,
  showEmpty,
  todos,
  localTodos,
  onToggle,
}: Props) {
  if (isLoading) {
    return (
      <div className='space-y-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <TodoSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (showEmpty) {
    return (
      <div className='rounded border p-4 text-center shadow'>
        Nothing to do yet!
      </div>
    );
  }

  return (
    <div className='space-y-2'>
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
