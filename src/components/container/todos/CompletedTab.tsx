'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { TodoTabContent } from '@/components/todo-tab-content';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { AppDispatch, RootState } from '@/store';
import { fetchTodos, setFilter, toggleTodoCompleted } from '@/store/todo-slice';

const CompletedTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, status, page, hasNextPage } = useSelector(
    (state: RootState) => state.todos
  );

  const { ref, inView } = useInView({ threshold: 0 });

  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // fetch completed todos
  useEffect(() => {
    dispatch(setFilter({ completed: true }));
    dispatch(fetchTodos({ completed: true, page: 1 }));
  }, [dispatch]);

  // infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && status !== 'loading') {
      dispatch(fetchTodos({ completed: true, page: page + 1 }));
    }
  }, [inView, hasNextPage, page, status, dispatch]);

  // buka dialog konfirmasi
  const handleOpenDialog = (id: string) => {
    setSelectedTodoId(id);
    setIsDialogOpen(true);
  };

  // konfirmasi un-complete
  const handleConfirm = () => {
    if (!selectedTodoId) return;

    dispatch(toggleTodoCompleted({ id: selectedTodoId, completed: false }))
      .unwrap()
      .then(() => toast.success('Todo dikembalikan ke tab Today/Upcoming!'))
      .catch(() => toast.error('Gagal mengupdate todo'))
      .finally(() => {
        setSelectedTodoId(null);
        setIsDialogOpen(false);
      });
  };

  return (
    <>
      <TodoTabContent
        isLoading={status === 'loading' && page === 1}
        isFetching={status === 'loading' && page > 1}
        isSuccess={status === 'succeeded'}
        todos={todos}
        localTodos={todos.reduce(
          (acc, t) => ({ ...acc, [t.id]: t.completed }),
          {}
        )}
        onToggle={handleOpenDialog}
      />

      {hasNextPage && (
        <div ref={ref} className='h-4 w-full'>
          Loading more...
        </div>
      )}

      {/* Dialog konfirmasi un-complete */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi</DialogTitle>
          </DialogHeader>
          <p>
            Apakah kamu yakin ingin mengembalikan todo ini ke tab
            Today/Upcoming?
          </p>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleConfirm}>Ya, kembalikan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompletedTab;
