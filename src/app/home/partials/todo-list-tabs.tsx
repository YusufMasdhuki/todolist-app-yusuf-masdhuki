'use client';

import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

import { TodoTabContent } from '@/components/todo-tab-content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useTodosByTab } from '@/hooks/useTodoTabs';

const TodoListTabs = () => {
  const todayDate = useMemo(() => dayjs().startOf('day'), []);

  const today = useTodosByTab('today', todayDate.toDate());
  const upcoming = useTodosByTab('upcoming', todayDate.toDate());
  const completed = useTodosByTab('completed', todayDate.toDate());

  const { ref: loadMoreRef, inView } = useInView();
  if (inView && today.query.hasNextPage && !today.query.isFetchingNextPage) {
    today.query.fetchNextPage();
  }

  return (
    <Tabs defaultValue='today' className='mx-auto w-full'>
      <TabsList className='grid w-full grid-cols-3 rounded-xl border bg-neutral-50 p-2 dark:border-neutral-900 dark:bg-neutral-950'>
        <TabsTrigger
          value='today'
          className='data-[state=active]:bg-primary-100 dark:data-[state=active]:bg-primary-100 data-[state=active]:text-white'
        >
          Today
        </TabsTrigger>
        <TabsTrigger
          value='upcoming'
          className='data-[state=active]:bg-primary-100 dark:data-[state=active]:bg-primary-100 data-[state=active]:text-white'
        >
          Upcoming
        </TabsTrigger>
        <TabsTrigger
          value='completed'
          className='data-[state=active]:bg-primary-100 dark:data-[state=active]:bg-primary-100 data-[state=active]:text-white'
        >
          Completed
        </TabsTrigger>
      </TabsList>

      <TabsContent value='today' className='mt-4'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <h2 className='text-display-xs font-bold'>Today</h2>{' '}
            <span className='gap-2 rounded-full bg-neutral-400 px-2 py-0.5 text-xs'>
              {today.todos.length} item
            </span>
          </div>
          <p>{todayDate.format('MMM D, YYYY')}</p>
        </div>
        <TodoTabContent
          isLoading={today.query.isLoading}
          isFetching={today.query.isFetching}
          isSuccess={today.query.isSuccess}
          todos={today.todos}
          localTodos={today.localTodos}
          onToggle={today.handleToggle}
        />
      </TabsContent>

      <TabsContent value='upcoming' className='mt-4'>
        <TodoTabContent
          isLoading={upcoming.query.isLoading}
          isFetching={upcoming.query.isFetching}
          isSuccess={upcoming.query.isSuccess}
          todos={upcoming.todos}
          localTodos={upcoming.localTodos}
          onToggle={upcoming.handleToggle}
        />
      </TabsContent>

      <TabsContent value='completed' className='mt-4'>
        <TodoTabContent
          isLoading={completed.query.isLoading}
          isFetching={completed.query.isFetching}
          isSuccess={completed.query.isSuccess}
          todos={completed.todos}
          localTodos={completed.localTodos}
          onToggle={completed.handleToggle}
        />
      </TabsContent>

      {today.query.hasNextPage && <div ref={loadMoreRef} className='h-10' />}
    </Tabs>
  );
};

export default TodoListTabs;
