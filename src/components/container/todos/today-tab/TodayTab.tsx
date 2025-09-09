'use client';

import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';

import AddTaskDialog from '@/components/addTaskModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import DeleteTodoDialog from '@/components/DeleteTodoDialog';
import { TodoTabContent } from '@/components/todo-tab-content';
import { Button } from '@/components/ui/button';

import { AppDispatch } from '@/store';
import { openAddTaskModal, resetTodoToEdit } from '@/store/todo-slice';

import { useTodayTab } from './useTodayTab';

const TodayTab = () => {
  const {
    todos,
    filteredTodos,
    status,
    hasNextPage,
    refObserver,
    page,
    isDialogOpen,
    handleConfirm,
    setIsDialogOpen,
    handleOpenDialog,

    selectedTodo,
    searchTerm,
  } = useTodayTab();

  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <div className='my-4 flex flex-col gap-1 md:my-5'>
        <div className='flex items-center gap-2'>
          <h2 className='text-display-xs dark:text-neutral-25 font-bold text-neutral-950'>
            Today
          </h2>
          <span className='dark:text-neutral-25 flex h-7 items-center justify-center rounded-full bg-[#DEDCDC] px-3 text-xs font-semibold text-neutral-950 dark:bg-neutral-900'>
            {filteredTodos.length} item
          </span>
        </div>
        <p className='text-sm text-neutral-500 dark:text-neutral-400'>
          {dayjs().format('MMM D, YYYY')}
        </p>
      </div>
      <TodoTabContent
        isLoading={status === 'loading' && page === 1}
        isFetching={status === 'loading' && page > 1}
        isSuccess={status === 'succeeded'}
        todos={filteredTodos}
        localTodos={todos.reduce(
          (acc, t) => ({ ...acc, [t.id]: t.completed }),
          {}
        )}
        onToggle={handleOpenDialog}
        searchTerm={searchTerm}
      />

      {hasNextPage && (
        <div
          ref={refObserver}
          className='h-4 w-full text-center text-sm text-gray-500'
        >
          Loading more...
        </div>
      )}

      {!searchTerm && (
        <Button
          size='add'
          className='mx-auto mt-4 md:mt-5'
          onClick={() => {
            dispatch(resetTodoToEdit());
            dispatch(openAddTaskModal());
          }}
        >
          + Add Task
        </Button>
      )}

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

      <AddTaskDialog
        selectedDate={dayjs()}
        fetchQuery={{
          completed: false,
          dateGte: dayjs().startOf('day').toISOString(),
          dateLte: dayjs().endOf('day').toISOString(),
          page: 1,
        }}
      />

      <DeleteTodoDialog
        fetchQuery={{
          completed: false,
          dateGte: dayjs().startOf('day').toISOString(),
          dateLte: dayjs().endOf('day').toISOString(),
          page: 1,
        }}
      />
    </>
  );
};

export default TodayTab;
