'use client';

import dayjs, { Dayjs } from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import AddTaskDialog from '@/components/addTaskModal';
import { TodoTabContent } from '@/components/todo-tab-content';
import { Button } from '@/components/ui/button';

import { AppDispatch, RootState } from '@/store';
import {
  fetchTodos,
  openAddTaskModal,
  setDateFiltered,
  setSelectedDate as setSelectedDateRedux,
  toggleTodoCompleted,
} from '@/store/todo-slice';

interface Props {
  selectedDate: Dayjs;
  setSelectedDate?: (d: Dayjs) => void;
}

const UpcomingTab = ({ selectedDate, setSelectedDate }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, status, page, hasNextPage, isDateFiltered } = useSelector(
    (state: RootState) => state.todos
  );

  const { ref, inView } = useInView({ threshold: 0 });

  // helper untuk param fetchTodos
  const buildQuery = (date?: Dayjs, page = 1) => {
    if (date) {
      return {
        completed: false,
        dateGte: date.startOf('day').toISOString(),
        dateLte: date.endOf('day').toISOString(),
        page,
      };
    }
    return { completed: false, page };
  };

  // Fetch pertama kali (semua upcoming kalau belum filter)
  useEffect(() => {
    if (!isDateFiltered) {
      dispatch(fetchTodos(buildQuery(undefined, 1)));
    }
  }, [dispatch, isDateFiltered]);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && status !== 'loading') {
      dispatch(
        fetchTodos(
          buildQuery(isDateFiltered ? selectedDate : undefined, page + 1)
        )
      );
    }
  }, [
    inView,
    hasNextPage,
    status,
    page,
    dispatch,
    isDateFiltered,
    selectedDate,
  ]);

  // Klik carousel untuk filter tanggal
  const handleDateChange = (date: Dayjs) => {
    dispatch(setDateFiltered(true));
    setSelectedDate?.(date);
    dispatch(setSelectedDateRedux(date.format('YYYY-MM-DD')));
    dispatch(fetchTodos(buildQuery(date, 1)));
  };

  // Reset filter
  const resetFilter = () => {
    dispatch(setDateFiltered(false));
    dispatch(fetchTodos(buildQuery(undefined, 1)));
  };

  // Toggle todo
  const handleToggle = useCallback(
    (id: string) => {
      dispatch(toggleTodoCompleted({ id }))
        .unwrap()
        .then(() => toast.success('Todo selesai dan dipindahkan ke Completed!'))
        .catch(() => toast.error('Gagal update todo'));
    },
    [dispatch]
  );

  return (
    <>
      {/* Header */}
      <div className='mb-4 flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <h2 className='text-display-xs font-bold'>
            {isDateFiltered ? 'Filtered' : 'Upcoming'}
          </h2>
          <span className='rounded-full bg-neutral-400 px-2 py-0.5 text-xs'>
            {todos.length} item
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <ChevronLeft
            className='cursor-pointer'
            onClick={() => handleDateChange(selectedDate.subtract(1, 'day'))}
          />
          <span
            className={
              selectedDate.isSame(dayjs(), 'day') && !isDateFiltered
                ? 'font-medium text-gray-400' // upcoming mode
                : 'text-foreground font-medium' // filtered mode
            }
          >
            {selectedDate.isSame(dayjs(), 'day')
              ? 'Today'
              : selectedDate.format('MMM D')}
          </span>
          <ChevronRight
            className='cursor-pointer'
            onClick={() => handleDateChange(selectedDate.add(1, 'day'))}
          />
        </div>
      </div>

      {/* Content */}
      <TodoTabContent
        isLoading={status === 'loading' && page === 1}
        isFetching={status === 'loading' && page > 1}
        isSuccess={status === 'succeeded'}
        todos={todos}
        localTodos={todos.reduce(
          (acc, t) => ({ ...acc, [t.id]: t.completed }),
          {}
        )}
        onToggle={handleToggle}
      />

      {hasNextPage && <div ref={ref} className='h-4 w-full'></div>}

      {isDateFiltered && (
        <Button className='mx-auto mt-2' onClick={resetFilter}>
          Show All Upcoming
        </Button>
      )}

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
