'use client';

import dayjs from 'dayjs';
import { useEffect, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import AddTaskDialog from '@/components/addTaskModal';
import DeleteTodoDialog from '@/components/DeleteTodoDialog';
import { TodoTabContent } from '@/components/todo-tab-content';
import { Button } from '@/components/ui/button';

import { AppDispatch } from '@/store';
import { selectActiveTodos } from '@/store/todo-selectors';
import { openAddTaskModal, resetTodoToEdit } from '@/store/todo-slice';
import { fetchTodos, toggleTodoCompleted } from '@/store/todo-thunks';

interface TodayTabProps {
  searchTerm: string;
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
}

const priorityMap: Record<string, 'LOW' | 'MEDIUM' | 'HIGH'> = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
};

const TodayTab: React.FC<TodayTabProps> = ({ searchTerm, priorityFilter }) => {
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector(selectActiveTodos);
  const { status, page, hasNextPage } = useSelector(
    (state: any) => state.todos
  );
  const { ref, inView } = useInView({ threshold: 0 });

  // Fetch awal
  useEffect(() => {
    const startOfDay = dayjs().startOf('day').toISOString();
    const endOfDay = dayjs().endOf('day').toISOString();

    dispatch(
      fetchTodos({
        completed: false,
        dateGte: startOfDay,
        dateLte: endOfDay,
        page: 1,
        priority:
          priorityFilter !== 'all' ? priorityMap[priorityFilter] : undefined,
      })
    );
  }, [dispatch, priorityFilter]);

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
          priority:
            priorityFilter !== 'all' ? priorityMap[priorityFilter] : undefined,
        })
      );
    }
  }, [inView, hasNextPage, page, status, dispatch, priorityFilter]);

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

  // Filter search di frontend
  const filteredTodos = useMemo(() => {
    if (!searchTerm) return todos;
    return todos.filter((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [todos, searchTerm]);

  return (
    <>
      {/* Content */}
      <TodoTabContent
        isLoading={status === 'loading' && page === 1}
        isFetching={status === 'loading' && page > 1}
        isSuccess={status === 'succeeded'}
        todos={filteredTodos}
        localTodos={todos.reduce(
          (acc, t) => ({ ...acc, [t.id]: t.completed }),
          {}
        )}
        onToggle={handleToggle}
        searchTerm={searchTerm}
      />

      {hasNextPage && (
        <div ref={ref} className='h-4 w-full text-center text-sm text-gray-500'>
          Loading more...
        </div>
      )}

      {/* Tombol Add Task hanya tampil kalau ada hasil */}
      {/* Tombol Add Task */}
      {!searchTerm && (
        <Button
          size='add'
          className='mx-auto mt-4'
          onClick={() => {
            dispatch(resetTodoToEdit());
            dispatch(openAddTaskModal());
          }}
        >
          + Add Task
        </Button>
      )}

      <AddTaskDialog
        selectedDate={dayjs()}
        fetchQuery={{
          completed: false,
          dateGte: dayjs().startOf('day').toISOString(),
          dateLte: dayjs().endOf('day').toISOString(),
          page: 1,
        }}
      />

      <DeleteTodoDialog
        fetchQuery={{
          completed: false,
          dateGte: dayjs().startOf('day').toISOString(),
          dateLte: dayjs().endOf('day').toISOString(),
          page: 1,
        }}
      />
    </>
  );
};

export default TodayTab;
