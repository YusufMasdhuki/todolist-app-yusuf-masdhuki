'use client';

import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

import { TodoTabContent } from '@/components/todo-tab-content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useTodoTabs } from '@/hooks/useTodoTabs';

const TodoListTabs = () => {
  const todayDate = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const {
    allQuery,
    localTodos,
    handleToggle,
    todayTodos,
    upcomingTodos,
    completedTodos,
  } = useTodoTabs(todayDate);

  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    if (inView && allQuery.hasNextPage && !allQuery.isFetchingNextPage) {
      allQuery.fetchNextPage();
    }
  }, [inView, allQuery.hasNextPage, allQuery.isFetchingNextPage, allQuery]);

  return (
    <Tabs defaultValue='today' className='mx-auto w-full'>
      <TabsList className='grid w-full grid-cols-3 rounded-xl border bg-neutral-50 p-2'>
        <TabsTrigger value='today'>Today</TabsTrigger>
        <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
        <TabsTrigger value='completed'>Completed</TabsTrigger>
      </TabsList>

      <TabsContent value='today' className='mt-4'>
        <TodoTabContent
          isLoading={allQuery.isLoading}
          isFetching={allQuery.isFetching}
          isSuccess={allQuery.isSuccess}
          todos={todayTodos}
          localTodos={localTodos}
          onToggle={handleToggle}
        />
      </TabsContent>

      <TabsContent value='upcoming' className='mt-4'>
        <TodoTabContent
          isLoading={allQuery.isLoading}
          isFetching={allQuery.isFetching}
          isSuccess={allQuery.isSuccess}
          todos={upcomingTodos}
          localTodos={localTodos}
          onToggle={handleToggle}
        />
      </TabsContent>

      <TabsContent value='completed' className='mt-4'>
        <TodoTabContent
          isLoading={allQuery.isLoading}
          isFetching={allQuery.isFetching}
          isSuccess={allQuery.isSuccess}
          todos={completedTodos}
          localTodos={localTodos}
          onToggle={handleToggle}
        />
      </TabsContent>

      {allQuery.hasNextPage && <div ref={loadMoreRef} className='h-10' />}
    </Tabs>
  );
};

export default TodoListTabs;
