'use client';

import dayjs, { Dayjs } from 'dayjs';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import AddTaskDialog from '@/components/addTaskModal';
import DeleteTodoDialog from '@/components/DeleteTodoDialog';
import { TodoTabContent } from '@/components/todo-tab-content';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { AppDispatch, RootState } from '@/store';
import {
  openAddTaskModal,
  resetTodoToEdit,
  setDateFiltered,
  setSelectedDate as setSelectedDateRedux,
} from '@/store/todo-slice';
import { fetchTodos, toggleTodoCompleted } from '@/store/todo-thunks';

interface Props {
  selectedDate: Dayjs;
  setSelectedDate?: (d: Dayjs) => void;
  searchTerm: string;
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
}

const priorityMap: Record<string, 'LOW' | 'MEDIUM' | 'HIGH'> = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
};

const UpcomingTab: React.FC<Props> = ({
  selectedDate,
  setSelectedDate,
  searchTerm,
  priorityFilter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { todos, status, page, hasNextPage, isDateFiltered } = useSelector(
    (state: RootState) => state.todos
  );
  const { ref, inView } = useInView({ threshold: 0 });
  const carouselRef = useRef<HTMLDivElement>(null);

  // Build query helper
  const buildQuery = useCallback(
    (date?: Dayjs, page = 1) => ({
      completed: false,
      dateGte: date?.startOf('day').toISOString(),
      dateLte: date?.endOf('day').toISOString(),
      page,
      priority:
        priorityFilter !== 'all' ? priorityMap[priorityFilter] : undefined,
    }),
    [priorityFilter] // tambahkan dependency yang digunakan di dalamnya
  );

  // Fetch pertama kali
  useEffect(() => {
    if (!isDateFiltered) dispatch(fetchTodos(buildQuery(undefined, 1)));
  }, [dispatch, isDateFiltered, buildQuery]); // sekarang ESLint happy

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
    buildQuery,
  ]);

  // Toggle todo
  const handleToggle = useCallback(
    (id: string) => {
      dispatch(toggleTodoCompleted({ id }))
        .unwrap()
        .then(() => toast.success('Todo selesai!'))
        .catch(() => toast.error('Gagal update todo'));
    },
    [dispatch]
  );

  // Handle date change (carousel / picker / left-right)
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

  // Generate ±10 hari untuk carousel
  const generateCarouselDates = () => {
    const days = [];
    for (let i = -10; i <= 10; i++) {
      days.push(selectedDate.add(i, 'day'));
    }
    return days;
  };
  const carouselDates = generateCarouselDates();

  const filteredTodos = useMemo(() => {
    if (!searchTerm) return todos;
    return todos.filter((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [todos, searchTerm]);

  return (
    <>
      {/* Header */}
      <div className='mb-4 flex items-center justify-between gap-2'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <h2 className='text-display-xs font-bold'>
              {isDateFiltered ? 'Filtered' : 'Upcoming'}
            </h2>
            <span className='rounded-full bg-neutral-400 px-2 py-0.5 text-xs'>
              {filteredTodos.length} item
            </span>
          </div>
          {/* Date picker */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <div className='flex cursor-pointer items-center gap-2'>
                {selectedDate.format('MMM D, YYYY')}{' '}
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }} // putar 180° saat terbuka
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown />
                </motion.div>
              </div>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={selectedDate.toDate()}
                onSelect={(date) => {
                  if (date) handleDateChange(dayjs(date));
                  setIsOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className='flex items-center gap-4'>
          {isDateFiltered && (
            <Button className='mx-auto mt-2' onClick={resetFilter}>
              Show All Upcoming
            </Button>
          )}
          {/* Navigation kiri-kanan */}
          <div className='flex items-center gap-2'>
            <ChevronLeft
              className='cursor-pointer'
              onClick={() => handleDateChange(selectedDate.subtract(1, 'day'))}
            />
            <span
              className={
                selectedDate.isSame(dayjs(), 'day') && !isDateFiltered
                  ? 'font-medium text-gray-400'
                  : 'text-foreground font-medium'
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
      </div>

      {/* Carousel ±10 hari */}
      <div
        ref={carouselRef}
        className='scrollbar-hide mb-4 flex gap-2 overflow-x-auto px-1'
      >
        {carouselDates.map((d) => {
          const isSelected = d.isSame(selectedDate, 'day');
          return (
            <button
              key={d.toString()}
              onClick={() => handleDateChange(d)}
              className={`flex min-w-[60px] flex-col items-center border-b-2 px-3 py-2 ${
                isSelected ? 'border-blue-500 font-bold' : 'border-transparent'
              }`}
            >
              <span className='text-xs'>{d.format('ddd').toLowerCase()}</span>
              <span>{d.format('DD')}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <TodoTabContent
        isLoading={status === 'loading' && page === 1}
        isFetching={status === 'loading' && page > 1}
        isSuccess={status === 'succeeded'}
        todos={filteredTodos}
        localTodos={todos.reduce(
          (acc, t) => ({ ...acc, [t.id]: t.completed }),
          {}
        )}
        onToggle={handleToggle}
        searchTerm={searchTerm}
      />

      {hasNextPage && <div ref={ref} className='h-4 w-full'></div>}

      {/* Jika search tidak ada hasil */}

      {/* Tombol Add Task */}
      {!searchTerm && (
        <Button
          size='add'
          className='mx-auto mt-4'
          onClick={() => {
            dispatch(resetTodoToEdit());
            dispatch(openAddTaskModal());
          }}
        >
          + Add Task
        </Button>
      )}

      <AddTaskDialog
        selectedDate={selectedDate}
        fetchQuery={{
          completed: false,
          dateGte: isDateFiltered
            ? selectedDate.startOf('day').toISOString()
            : undefined,
          dateLte: isDateFiltered
            ? selectedDate.endOf('day').toISOString()
            : undefined,
          page: 1,
        }}
      />
      <DeleteTodoDialog
        fetchQuery={{
          completed: false,
          dateGte: isDateFiltered
            ? selectedDate.startOf('day').toISOString()
            : undefined,
          dateLte: isDateFiltered
            ? selectedDate.endOf('day').toISOString()
            : undefined,
          page: 1,
        }}
      />
    </>
  );
};

export default UpcomingTab;
