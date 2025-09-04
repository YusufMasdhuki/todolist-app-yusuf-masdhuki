'use client';

import { useMemo } from 'react';
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
  if (inView && allQuery.hasNextPage && !allQuery.isFetchingNextPage) {
    allQuery.fetchNextPage();
  }

  return (
    <Tabs defaultValue='today' className='mx-auto w-full'>
      <TabsList className='grid w-full grid-cols-3 rounded-xl border bg-neutral-50 p-2'>
        <TabsTrigger value='today'>Today</TabsTrigger>
        <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
        <TabsTrigger value='completed'>Completed</TabsTrigger>
      </TabsList>

      <TabsContent value='today' className='mt-4'>
        <TodoTabContent
          showEmpty={allQuery.isSuccess && todayTodos.length === 0}
          isLoading={allQuery.isLoading}
          todos={todayTodos}
          localTodos={localTodos}
          onToggle={handleToggle}
          emptyLabel='Today'
        />
      </TabsContent>

      <TabsContent value='upcoming' className='mt-4'>
        <TodoTabContent
          showEmpty={allQuery.isSuccess && todayTodos.length === 0}
          isLoading={allQuery.isLoading}
          todos={upcomingTodos}
          localTodos={localTodos}
          onToggle={handleToggle}
          emptyLabel='Upcoming'
        />
      </TabsContent>

      <TabsContent value='completed' className='mt-4'>
        <TodoTabContent
          showEmpty={allQuery.isSuccess && todayTodos.length === 0}
          isLoading={allQuery.isLoading}
          todos={completedTodos}
          localTodos={localTodos}
          onToggle={handleToggle}
          emptyLabel='Completed'
        />
      </TabsContent>

      {allQuery.hasNextPage && <div ref={loadMoreRef} className='h-10' />}
    </Tabs>
  );
};

export default TodoListTabs;
