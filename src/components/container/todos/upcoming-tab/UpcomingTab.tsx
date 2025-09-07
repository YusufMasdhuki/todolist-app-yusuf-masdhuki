'use client';

import clsx from 'clsx';
import dayjs from 'dayjs';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import AddTaskDialog from '@/components/addTaskModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import DeleteTodoDialog from '@/components/DeleteTodoDialog';
import { TodoTabContent } from '@/components/todo-tab-content';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { AppDispatch } from '@/store';
import { openAddTaskModal, resetTodoToEdit } from '@/store/todo-slice';

import { UpcomingTabProps } from './helper';
import { useUpcomingTab } from './useUpcomingTab';

const UpcomingTab: React.FC<UpcomingTabProps> = ({
  selectedDate,
  setSelectedDate,
  searchTerm,
  priorityFilter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const {
    todos,
    filteredTodos,
    status,
    hasNextPage,
    refObserver,
    isDateFiltered,
    isDialogOpen,
    handleOpenDialog,
    setIsDialogOpen,
    handleConfirm,
    selectedTodo,
    handleDateChange,
    resetFilter,
    carouselDates,
  } = useUpcomingTab({
    selectedDate,
    setSelectedDate,
    searchTerm,
    priorityFilter,
  });

  return (
    <>
      {/* Header */}
      <div className='dark:text-neutral-25 mb-4 flex items-center justify-between gap-2 text-neutral-950'>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <h2 className='text-display-xs font-bold'>
              {isDateFiltered ? 'Filtered' : 'Upcoming'}
            </h2>
            <span className='flex h-7 items-center justify-center rounded-full bg-[#DEDCDC] px-3 text-xs font-semibold dark:bg-neutral-900'>
              {filteredTodos.length} item
            </span>
          </div>

          {/* Date picker */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <div className='flex cursor-pointer items-center gap-1 text-sm'>
                {selectedDate.format('MMM D, YYYY')}
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className='size-4' />
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
            <Button className='mx-auto h-9 px-2 text-sm' onClick={resetFilter}>
              Show All
            </Button>
          )}

          {/* Navigation kiri-kanan */}
          <div className='flex h-9 items-center gap-3 rounded-md border border-[#DEDCDC] px-3 dark:border-neutral-900'>
            <ChevronLeft
              className='size-5 cursor-pointer'
              onClick={() => handleDateChange(selectedDate.subtract(1, 'day'))}
            />
            <span
              className={clsx(
                'font-medium',
                !isDateFiltered
                  ? 'text-neutral-500 dark:text-neutral-400'
                  : 'dark:text-neutral-25 text-neutral-950'
              )}
            >
              {selectedDate.isSame(dayjs(), 'day')
                ? 'Today'
                : selectedDate.format('MMM D')}
            </span>

            <ChevronRight
              className='size-5 cursor-pointer'
              onClick={() => handleDateChange(selectedDate.add(1, 'day'))}
            />
          </div>
        </div>
      </div>

      {/* Carousel ±10 hari */}
      <div className='scrollbar-hide mb-4 flex gap-2 overflow-x-auto border-b border-[#DEDCDC] px-1 dark:border-neutral-900'>
        {carouselDates.map((d) => {
          const isSelected = d.isSame(selectedDate, 'day');
          return (
            <button
              key={d.format('YYYY-MM-DD')}
              onClick={() => handleDateChange(d)}
              className={clsx(
                'flex cursor-pointer items-center gap-2 border-b-2 px-3 py-2',
                isSelected ? 'border-primary-100' : 'border-transparent'
              )}
            >
              <span className='text-sm'>{d.format('ddd').toLowerCase()}</span>
              <span
                className={clsx(
                  'flex size-6 items-center justify-center rounded-lg text-sm',
                  isSelected && 'bg-primary-100 text-white'
                )}
              >
                {d.format('DD')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <TodoTabContent
        isLoading={status === 'loading' && !hasNextPage}
        isFetching={status === 'loading' && hasNextPage}
        isSuccess={status === 'succeeded'}
        todos={filteredTodos}
        localTodos={todos.reduce(
          (acc, t) => ({ ...acc, [t.id]: t.completed }),
          {}
        )}
        onToggle={(todo) => handleOpenDialog(todo)} // ✅ langsung todo, bukan id
        searchTerm={searchTerm}
      />

      {hasNextPage && <div ref={refObserver} className='h-4 w-full'></div>}

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

      <ConfirmDialog
        open={isDialogOpen}
        title='Mark as Completed'
        description={
          <>
            Are you sure you want to mark{' '}
            <span className='font-semibold text-blue-600'>
              {selectedTodo?.title}
            </span>{' '}
            as completed?
          </>
        }
        confirmText='Yes, complete it'
        cancelText='Cancel'
        onConfirm={handleConfirm}
        onCancel={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default UpcomingTab;
