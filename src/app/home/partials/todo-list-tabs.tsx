'use client';

import dayjs, { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';

import CompletedTab from '@/components/container/todos/CompletedTab';
import SearchBarRedux from '@/components/container/todos/search-bar';
import TodayTab from '@/components/container/todos/TodayTab';
import UpcomingTab from '@/components/container/todos/UpcomingTab';
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
    setPriorityFilter(filter.priority as any);
  };

  return (
    <div className='mx-auto w-full'>
      {/* Search bar + Priority dropdown */}
      <SearchBarRedux onFilterChange={handleFilterChange} />

      {/* Tabs */}
      <Tabs defaultValue='today' className='w-full'>
        <TabsList className='grid w-full grid-cols-3 rounded-xl border bg-neutral-50 p-2'>
          <TabsTrigger value='today'>Today</TabsTrigger>
          <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
          <TabsTrigger value='completed'>Completed</TabsTrigger>
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
