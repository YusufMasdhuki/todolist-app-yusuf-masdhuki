'use client';

import dayjs, { Dayjs } from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import AddTaskDialog from '@/components/addTaskModal';
import { TodoTabContent } from '@/components/todo-tab-content';
import { Button } from '@/components/ui/button';

import { RootState, AppDispatch } from '@/store';
import {
  fetchTodos,
  openAddTaskModal,
  setSelectedDate as setSelectedDateRedux,
} from '@/store/todo-slice';

interface Props {
  selectedDate: Dayjs;
  setSelectedDate?: (d: Dayjs) => void; // opsional
}

const UpcomingTab = ({ selectedDate, setSelectedDate }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, status } = useSelector((state: RootState) => state.todos);

  const handleDateChange = (date: Dayjs) => {
    const startOfDay = date.startOf('day').toISOString();
    const endOfDay = date.endOf('day').toISOString();

    setSelectedDate?.(date); // update state lokal jika ada
    dispatch(setSelectedDateRedux(date.format('YYYY-MM-DD')));
    dispatch(fetchTodos({ dateGte: startOfDay, dateLte: endOfDay }));
  };

  return (
    <>
      <div className='mb-4 flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          {' '}
          <h2 className='text-display-xs font-bold'>Upcoming</h2>
          <span className='rounded-full bg-neutral-400 px-2 py-0.5 text-xs'>
            {todos.length} item
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <ChevronLeft
            className='cursor-pointer'
            onClick={() => handleDateChange(selectedDate.subtract(1, 'day'))}
          />
          {selectedDate.isSame(dayjs(), 'day')
            ? 'Today'
            : selectedDate.format('MMM D')}
          <ChevronRight
            className='cursor-pointer'
            onClick={() => handleDateChange(selectedDate.add(1, 'day'))}
          />
        </div>
      </div>

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
      <AddTaskDialog selectedDate={selectedDate} />
    </>
  );
};

export default UpcomingTab;
