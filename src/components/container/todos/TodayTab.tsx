'use client';

import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AddTaskDialog from '@/components/addTaskModal';
import { TodoTabContent } from '@/components/todo-tab-content';
import { Button } from '@/components/ui/button';

import { AppDispatch, RootState } from '@/store';
import { fetchTodos, openAddTaskModal, setFilter } from '@/store/todo-slice';

const TodayTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, status } = useSelector((state: RootState) => state.todos);

  useEffect(() => {
    const startOfDay = dayjs().startOf('day').toISOString();
    const endOfDay = dayjs().endOf('day').toISOString();

    // Optional: simpan filter di redux (misal berdasarkan completed)
    dispatch(setFilter({ completed: false }));

    // Fetch todos untuk hari ini
    dispatch(fetchTodos({ dateGte: startOfDay, dateLte: endOfDay }));
  }, [dispatch]);

  return (
    <>
      <TodoTabContent
        isLoading={status === 'loading'}
        isFetching={status === 'loading'}
        isSuccess={status === 'succeeded'}
        todos={todos}
        localTodos={{}}
        onToggle={() => {}}
      />
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
