'use client';

import { useEffect, useState, useMemo } from 'react';
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

import { TodoItem } from '@/interfaces/get-todos-type';
import { AppDispatch, RootState } from '@/store';
import { fetchTodos, toggleTodoCompleted } from '@/store/todo-thunks';

interface CompletedTabProps {
  searchTerm: string;
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
}

const priorityMap: Record<string, 'LOW' | 'MEDIUM' | 'HIGH'> = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
};

const CompletedTab: React.FC<CompletedTabProps> = ({
  searchTerm,
  priorityFilter,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { todos, status, page, hasNextPage } = useSelector(
    (state: RootState) => state.todos
  );

  const { ref, inView } = useInView({ threshold: 0 });

  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch pertama kali
  useEffect(() => {
    dispatch(
      fetchTodos({
        completed: true,
        page: 1,
        priority:
          priorityFilter !== 'all' ? priorityMap[priorityFilter] : undefined,
      })
    );
  }, [dispatch, priorityFilter]);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && status !== 'loading') {
      dispatch(
        fetchTodos({
          completed: true,
          page: page + 1,
          priority:
            priorityFilter !== 'all' ? priorityMap[priorityFilter] : undefined,
        })
      );
    }
  }, [inView, hasNextPage, page, status, dispatch, priorityFilter]);

  // Filter search lokal
  const filteredTodos: TodoItem[] = useMemo(() => {
    return todos.filter((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [todos, searchTerm]);

  // Dialog
  const handleOpenDialog = (id: string) => {
    setSelectedTodoId(id);
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedTodoId) return;

    dispatch(toggleTodoCompleted({ id: selectedTodoId }))
      .unwrap()
      .then(() => toast.success('Todo dikembalikan ke Today/Upcoming!'))
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
        todos={filteredTodos}
        localTodos={todos.reduce(
          (acc, t) => ({ ...acc, [t.id]: t.completed }),
          {}
        )}
        onToggle={handleOpenDialog}
        searchTerm={searchTerm}
      />

      {hasNextPage && (
        <div ref={ref} className='h-4 w-full'>
          Loading more...
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi</DialogTitle>
          </DialogHeader>
          <p>Apakah kamu yakin ingin mengembalikan todo ini?</p>
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
