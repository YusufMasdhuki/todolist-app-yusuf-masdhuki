'use client';

import dayjs from 'dayjs';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { TodoTabContent } from '@/components/todo-tab-content';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useTodosByTab } from '@/hooks/useTodoTabs';

const getWeekDays = (centerDate: dayjs.Dayjs) => {
  return Array.from({ length: 7 }, (_, i) =>
    centerDate.startOf('week').add(i, 'day')
  );
};

const TodoListTabs = () => {
  const todayDate = useMemo(() => dayjs().startOf('day'), []);
  const [selectedDate, setSelectedDate] = useState(todayDate);

  const today = useTodosByTab('today', todayDate.toDate());
  const upcoming = useTodosByTab('upcoming', selectedDate.toDate());
  const completed = useTodosByTab('completed', todayDate.toDate());

  const { ref: loadMoreRef, inView } = useInView();
  if (inView && today.query.hasNextPage && !today.query.isFetchingNextPage) {
    today.query.fetchNextPage();
  }

  const weekDays = getWeekDays(selectedDate);

  return (
    <Tabs defaultValue='today' className='mx-auto w-full'>
      <TabsList className='grid w-full grid-cols-3 rounded-xl border bg-neutral-50 p-2 dark:border-neutral-900 dark:bg-neutral-950'>
        <TabsTrigger value='today'>Today</TabsTrigger>
        <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
        <TabsTrigger value='completed'>Completed</TabsTrigger>
      </TabsList>

      {/* TODAY */}
      <TabsContent value='today' className='mt-4'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <h2 className='text-display-xs font-bold'>Today</h2>
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

      {/* UPCOMING */}
      <TabsContent value='upcoming' className='mt-4'>
        <div className='flex items-center justify-between gap-2'>
          <div className='mb-4 flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <h2 className='text-display-xs font-bold'>Upcoming</h2>
              <span className='gap-2 rounded-full bg-neutral-400 px-2 py-0.5 text-xs'>
                {upcoming.todos.length} item
              </span>
            </div>

            {/* Date picker dengan shadcn */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline' className='flex items-center gap-2'>
                  {selectedDate.format('MMM D, YYYY')}
                  <ChevronDown className='h-4 w-4 opacity-70' />
                </Button>
              </PopoverTrigger>
              <PopoverContent align='start' className='p-0'>
                <Calendar
                  mode='single'
                  selected={selectedDate.toDate()}
                  onSelect={(d) => d && setSelectedDate(dayjs(d))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Navigasi kiri-kanan */}
          <div className='flex items-center gap-2'>
            <ChevronLeft
              className='cursor-pointer'
              onClick={() => setSelectedDate((d) => d.subtract(1, 'day'))}
            />
            {selectedDate.isSame(todayDate, 'day')
              ? 'Today'
              : selectedDate.format('MMM D')}
            <ChevronRight
              className='cursor-pointer'
              onClick={() => setSelectedDate((d) => d.add(1, 'day'))}
            />
          </div>
        </div>

        {/* Carousel minggu */}
        <div className='mb-4 flex overflow-x-auto border-b border-neutral-400'>
          {weekDays.map((day) => {
            const isActive = day.isSame(selectedDate, 'day');
            return (
              <span
                key={day.format('YYYY-MM-DD')}
                onClick={() => setSelectedDate(day)}
                className={`flex cursor-pointer items-center gap-1 px-2 pb-2 ${
                  isActive
                    ? 'border-primary-100 text-primary-100 border-b-4 font-bold'
                    : 'text-neutral-600'
                }`}
              >
                <span> {day.format('ddd')}</span>
                <span
                  className={`ml-1 rounded-lg px-2 py-0.5 ${
                    isActive ? 'bg-primary-100 text-white' : ''
                  }`}
                >
                  {day.format('D')}
                </span>
              </span>
            );
          })}
        </div>

        <TodoTabContent
          isLoading={upcoming.query.isLoading}
          isFetching={upcoming.query.isFetching}
          isSuccess={upcoming.query.isSuccess}
          todos={upcoming.todos}
          localTodos={upcoming.localTodos}
          onToggle={upcoming.handleToggle}
        />
      </TabsContent>

      {/* COMPLETED */}
      <TabsContent value='completed' className='mt-4'>
        <div className='mb-4 flex items-center gap-2'>
          <Image
            src='/icons/completed-icon.svg'
            alt='Done'
            width={24}
            height={24}
          />
          <h2 className='text-display-xs font-bold'>Completed </h2>
          <span className='rounded-full bg-neutral-400 px-2 py-0.5 text-xs'>
            {completed.todos.length} item
          </span>
        </div>
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
