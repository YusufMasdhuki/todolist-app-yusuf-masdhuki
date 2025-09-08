'use client';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect } from 'react';

import ClientOnlySearchBar from '@/components/container/searchBar/ClientOnlySearchBar ';
import CompletedTab from '@/components/container/todos/completed-tab/CompletedTab';
import TodayTab from '@/components/container/todos/today-tab/TodayTab';
import UpcomingTab from '@/components/container/todos/upcoming-tab/UpcomingTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TodoListTabs = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    setSelectedDate(dayjs().startOf('day'));
  }, []);

  if (!selectedDate) return null;

  return (
    <div className='mx-auto w-full'>
      <ClientOnlySearchBar />

      <Tabs defaultValue='today' className='w-full'>
        <TabsList className='dark:text-neutral-25 grid w-full grid-cols-3 rounded-xl border p-2 text-neutral-950 dark:bg-neutral-950'>
          <TabsTrigger
            value='today'
            className='data-[state=active]:bg-primary-100 dark:data-[state=active]:bg-primary-100 data-[state=active]:text-white dark:data-[state=active]:text-white'
          >
            Today
          </TabsTrigger>
          <TabsTrigger
            value='upcoming'
            className='data-[state=active]:bg-primary-100 dark:data-[state=active]:bg-primary-100 data-[state=active]:text-white dark:data-[state=active]:text-white'
          >
            Upcoming
          </TabsTrigger>
          <TabsTrigger
            value='completed'
            className='data-[state=active]:bg-primary-100 dark:data-[state=active]:bg-primary-100 data-[state=active]:text-white dark:data-[state=active]:text-white'
          >
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value='today'>
          <TodayTab />
        </TabsContent>

        <TabsContent value='upcoming'>
          <UpcomingTab
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </TabsContent>

        <TabsContent value='completed'>
          <CompletedTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TodoListTabs;
