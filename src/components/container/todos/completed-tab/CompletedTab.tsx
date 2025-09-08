'use client';

import Image from 'next/image';

import { TodoTabContent } from '@/components/todo-tab-content';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useCompletedTab } from './useCompletedTab';

const CompletedTab = () => {
  const {
    todos,
    filteredTodos,
    status,
    hasNextPage,
    refObserver,
    isDialogOpen,
    handleOpenDialog,
    handleConfirm,
    selectedTodo,
    setIsDialogOpen,
    searchTerm,
  } = useCompletedTab();

  return (
    <>
      <div className='my-5 flex items-center gap-2'>
        <Image
          src='/icons/completed-icon.svg'
          alt='completed'
          width={24}
          height={24}
        />
        <h2 className='text-display-xs dark:text-neutral-25 font-bold text-neutral-950'>
          Completed
        </h2>
        <span className='dark:text-neutral-25 flex h-7 items-center justify-center rounded-full bg-[#DEDCDC] px-3 text-xs font-semibold text-neutral-950 dark:bg-neutral-900'>
          {filteredTodos.length} item
        </span>
      </div>
      <TodoTabContent
        isLoading={status === 'loading' && !hasNextPage}
        isFetching={status === 'loading' && hasNextPage}
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
        <div ref={refObserver} className='h-4 w-full'>
          Loading more...
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to return{' '}
            <span className='font-semibold text-blue-600'>
              {selectedTodo?.title}
            </span>
            ?
          </p>
          <DialogFooter>
            <Button
              className='bg-neutral-400 px-3 hover:bg-neutral-300 dark:bg-neutral-600'
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button className='px-3' onClick={handleConfirm}>
              Yes, return it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompletedTab;
