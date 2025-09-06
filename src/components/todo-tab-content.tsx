'use client';

import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

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
  fetchNextPage?: () => void; // untuk infinite scroll
  hasNextPage?: boolean;
};

export function TodoTabContent({
  isLoading,
  isFetching,
  isSuccess,
  todos,
  onToggle,
  fetchNextPage,
  hasNextPage = false,
}: Props) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // ⏩ Trigger fetchNextPage saat last card kelihatan
  useEffect(() => {
    if (inView && hasNextPage && !isFetching && fetchNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  // ⏳ Loading awal → skeleton
  if (isLoading || (isFetching && todos.length === 0)) {
    return (
      <div className='space-y-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <TodoSkeleton key={i} />
        ))}
      </div>
    );
  }

  // ✅ Empty state
  if (isSuccess && !isFetching && todos.length === 0) {
    return (
      <div className='rounded border p-4 text-center shadow'>
        Nothing to do yet!
      </div>
    );
  }

  // 📋 Data tersedia
  return (
    <div className='flex flex-col gap-3'>
      {todos.map((todo, i) => {
        const isLast = i === todos.length - 1;
        return (
          <div key={todo.id} ref={isLast ? ref : undefined}>
            <TodoCard todo={todo} onToggle={onToggle} />
          </div>
        );
      })}

      {/* ⏳ Loader kecil di bawah saat fetch next page */}

      {isFetching && todos.length > 0 && (
        <div className='flex items-center justify-center py-3 text-sm text-gray-500'>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Loading more...
        </div>
      )}
    </div>
  );
}
