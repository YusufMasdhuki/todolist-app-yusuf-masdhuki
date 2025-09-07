'use client';

import dayjs, { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';

import CompletedTab from '@/components/container/todos/completed-tab/CompletedTab';
import SearchBar from '@/components/container/todos/search-bar';
import TodayTab from '@/components/container/todos/today-tab/TodayTab';
import UpcomingTab from '@/components/container/todos/upcoming-tab/UpcomingTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TodoListTabs = () => {
  const todayDate = useMemo(() => dayjs().startOf('day'), []);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(todayDate);

  // Search + Priority filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<
    'all' | 'low' | 'medium' | 'high'
  >('all');

  // Handler untuk SearchBar
  const handleFilterChange = (filter: { search: string; priority: string }) => {
    setSearchTerm(filter.search);
    setPriorityFilter(filter.priority as 'all' | 'low' | 'medium' | 'high');
  };

  return (
    <div className='mx-auto w-full'>
      {/* Search bar + Priority dropdown */}
      <SearchBar onFilterChange={handleFilterChange} />

      {/* Tabs */}
      <Tabs defaultValue='today' className='w-full'>
        <TabsList className='dark:text-neutral-25 grid w-full grid-cols-3 rounded-xl border bg-neutral-50 p-2 text-neutral-950 dark:bg-neutral-950'>
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

        {/* Tabs Content */}
        <TabsContent value='today'>
          <TodayTab searchTerm={searchTerm} priorityFilter={priorityFilter} />
        </TabsContent>

        <TabsContent value='upcoming'>
          <UpcomingTab
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            searchTerm={searchTerm}
            priorityFilter={priorityFilter}
          />
        </TabsContent>

        <TabsContent value='completed'>
          <CompletedTab
            searchTerm={searchTerm}
            priorityFilter={priorityFilter}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TodoListTabs;
