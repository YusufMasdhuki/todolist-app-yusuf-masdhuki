'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { TodoTabContent } from '@/components/todo-tab-content';

import { AppDispatch, RootState } from '@/store';
import { fetchTodos, setFilter } from '@/store/todo-slice';

const CompletedTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, status } = useSelector((state: RootState) => state.todos);

  useEffect(() => {
    // set filter completed ke true
    dispatch(setFilter({ completed: true }));

    // fetch todos yang completed
    dispatch(fetchTodos({ completed: true }));
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
    </>
  );
};

export default CompletedTab;
