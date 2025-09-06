'use client';

import dayjs from 'dayjs';
import { useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import AddTaskDialog from '@/components/addTaskModal';
import { TodoTabContent } from '@/components/todo-tab-content';
import { Button } from '@/components/ui/button';

import { AppDispatch } from '@/store';
import {
  fetchTodos,
  openAddTaskModal,
  toggleTodoCompleted,
  selectActiveTodos,
} from '@/store/todo-slice';

const TodayTab = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Ambil hanya todos aktif untuk hari ini via selector
  const todos = useSelector(selectActiveTodos);

  const { status, page, hasNextPage } = useSelector(
    (state: any) => state.todos
  );

  const { ref, inView } = useInView({ threshold: 0 });

  // Fetch awal (hanya yang hari ini, belum completed)
  useEffect(() => {
    const startOfDay = dayjs().startOf('day').toISOString();
    const endOfDay = dayjs().endOf('day').toISOString();

    dispatch(
      fetchTodos({
        completed: false,
        dateGte: startOfDay,
        dateLte: endOfDay,
        page: 1,
      })
    );
  }, [dispatch]);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && status !== 'loading') {
      const startOfDay = dayjs().startOf('day').toISOString();
      const endOfDay = dayjs().endOf('day').toISOString();

      dispatch(
        fetchTodos({
          completed: false,
          dateGte: startOfDay,
          dateLte: endOfDay,
          page: page + 1,
        })
      );
    }
  }, [inView, hasNextPage, page, status, dispatch]);

  // Toggle completed
  const handleToggle = useCallback(
    (id: string) => {
      dispatch(toggleTodoCompleted({ id }))
        .unwrap()
        .then(() => toast.success('Todo completed!'))
        .catch(() => toast.error('Failed to update todo'));
    },
    [dispatch]
  );

  return (
    <>
      <TodoTabContent
        isLoading={status === 'loading' && page === 1}
        isFetching={status === 'loading' && page > 1}
        isSuccess={status === 'succeeded'}
        todos={todos}
        localTodos={todos.reduce(
          (acc, t) => ({ ...acc, [t.id]: t.completed }),
          {}
        )}
        onToggle={handleToggle}
      />

      {hasNextPage && (
        <div ref={ref} className='h-4 w-full text-center text-sm text-gray-500'>
          Loading more...
        </div>
      )}

      <Button
        size='add'
        className='mx-auto mt-4'
        onClick={() => dispatch(openAddTaskModal())}
      >
        + Add Task
      </Button>

      <AddTaskDialog selectedDate={dayjs()} />
    </>
  );
};

export default TodayTab;
