'use client';

import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch } from 'react-redux';

import { TodoCard } from '@/components/todo-card';
import { TodoSkeleton } from '@/components/todo-skeleton';

import { TodoTabContentProps } from '@/interfaces/TodoTabContentProps';
import { AppDispatch } from '@/store';
import { openDeleteDialog, openEditTaskModal } from '@/store/todo-slice';

export const TodoTabContent: React.FC<TodoTabContentProps> = ({
  isLoading,
  isFetching,
  isSuccess,
  todos,
  onToggle,
  fetchNextPage,
  hasNextPage = false,
  searchTerm = '',
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

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

  if (isSuccess && !isFetching && todos.length === 0) {
    if (searchTerm) {
      return (
        <div className='dark:text-neutral-25 text-center font-semibold text-neutral-950'>
          Try a different keyword.
        </div>
      );
    }
    return (
      <div className='dark:text-neutral-25 text-center font-semibold text-neutral-950'>
        Nothing to do yet!
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      {todos.map((todo, i) => {
        const isLast = i === todos.length - 1;
        return (
          <div key={todo.id} ref={isLast ? ref : undefined}>
            <TodoCard
              todo={todo}
              onToggle={onToggle}
              onEdit={() => dispatch(openEditTaskModal(todo))}
              onDelete={(id) => {
                const todoItem = todos.find((t) => t.id === id);
                if (todoItem) dispatch(openDeleteDialog(todoItem));
              }}
            />
          </div>
        );
      })}

      {isFetching && todos.length > 0 && (
        <div className='flex items-center justify-center py-3 text-sm text-gray-500'>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Loading more...
        </div>
      )}
    </div>
  );
};
