'use client';

import dayjs from 'dayjs';
import { useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import AddTaskDialog from '@/components/addTaskModal';
import { TodoTabContent } from '@/components/todo-tab-content';
import { Button } from '@/components/ui/button';

import { AppDispatch, RootState } from '@/store';
import {
  fetchTodos,
  openAddTaskModal,
  setFilter,
  toggleTodoCompleted,
} from '@/store/todo-slice';

const TodayTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, status, page, hasNextPage, filter } = useSelector(
    (state: RootState) => state.todos
  );

  const startOfDay = dayjs().startOf('day').toISOString();
  const endOfDay = dayjs().endOf('day').toISOString();

  const { ref, inView } = useInView({ threshold: 0 });

  // ⬅️ Set filter global sekali aja waktu mount
  useEffect(() => {
    dispatch(
      setFilter({
        completed: false,
        dateGte: startOfDay,
        dateLte: endOfDay,
      })
    );
    dispatch(
      fetchTodos({
        completed: false,
        dateGte: startOfDay,
        dateLte: endOfDay,
        page: 1,
      })
    );
  }, [dispatch, startOfDay, endOfDay]);

  // infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && status !== 'loading') {
      dispatch(fetchTodos({ ...filter, page: page + 1 }));
    }
  }, [inView, hasNextPage, page, status, dispatch, filter]);

  // toggle completed
  const handleToggle = useCallback(
    (id: string) => {
      dispatch(toggleTodoCompleted({ id }))
        .unwrap()
        .then(() => {
          toast.success('Todo completed!');
        })
        .catch(() => {
          toast.error('Failed to update todo');
        });
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
        fetchNextPage={() =>
          dispatch(fetchTodos({ ...filter, page: page + 1 }))
        }
        hasNextPage={hasNextPage}
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
