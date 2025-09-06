'use client';

import dayjs, { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';

import CompletedTab from '@/components/container/todos/CompletedTab';
import TodayTab from '@/components/container/todos/TodayTab';
import UpcomingTab from '@/components/container/todos/UpcomingTab';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const TodoListTabs = () => {
  const todayDate = useMemo(() => dayjs().startOf('day'), []);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(todayDate);

  return (
    <Tabs defaultValue='today' className='mx-auto w-full'>
      <TabsList className='grid w-full grid-cols-3 rounded-xl border bg-neutral-50 p-2'>
        <TabsTrigger value='today'>Today</TabsTrigger>
        <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
        <TabsTrigger value='completed'>Completed</TabsTrigger>
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
  );
};

export default TodoListTabs;
