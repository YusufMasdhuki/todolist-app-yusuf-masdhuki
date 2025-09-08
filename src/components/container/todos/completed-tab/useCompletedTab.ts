import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { TodoItem } from '@/interfaces/get-todos-type';
import { priorityMap } from '@/lib/priority-map';
import { AppDispatch, RootState } from '@/store';
import { fetchTodos, toggleTodoCompleted } from '@/store/todo-thunks';

export const useCompletedTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, status, page, hasNextPage, isDateFiltered, selectedDate } =
    useSelector((state: RootState) => state.todos);
  const { searchTerm, priority } = useSelector(
    (state: RootState) => state.filter
  );

  const { ref, inView } = useInView({ threshold: 0 });

  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Helper untuk fetch todos
  const fetchCompletedTodos = useCallback(
    (pageToFetch = 1) => {
      dispatch(
        fetchTodos({
          completed: true,
          page: pageToFetch,
          priority: priority !== 'all' ? priorityMap[priority] : undefined,
        })
      );
    },
    [dispatch, priority]
  );

  // Fetch pertama kali
  useEffect(() => {
    fetchCompletedTodos(1);
  }, [fetchCompletedTodos]);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && status !== 'loading') {
      fetchCompletedTodos(page + 1);
    }
  }, [inView, hasNextPage, page, status, fetchCompletedTodos]);

  // Filter search lokal
  const filteredTodos: TodoItem[] = useMemo(() => {
    if (!searchTerm) return todos;
    return todos.filter((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [todos, searchTerm]);

  // Dialog
  const handleOpenDialog = useCallback((id: string) => {
    setSelectedTodoId(id);
    setIsDialogOpen(true);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selectedTodoId) return;

    dispatch(toggleTodoCompleted({ id: selectedTodoId }))
      .unwrap()
      .then(() => {
        toast.success('Todo dikembalikan ke Today/Upcoming!');

        if (isDateFiltered && selectedDate) {
          dispatch(
            fetchTodos({
              completed: false,
              dateGte: dayjs(selectedDate).startOf('day').toISOString(),
              dateLte: dayjs(selectedDate).endOf('day').toISOString(),
              page: 1,
            })
          );
        } else {
          dispatch(fetchTodos({ completed: false, page: 1 }));
        }

        fetchCompletedTodos(1);
      })
      .catch(() => toast.error('Gagal mengupdate todo'))
      .finally(() => {
        setSelectedTodoId(null);
        setIsDialogOpen(false);
      });
  }, [
    dispatch,
    selectedTodoId,
    isDateFiltered,
    selectedDate,
    fetchCompletedTodos,
  ]);

  const selectedTodo = useMemo(() => {
    return todos.find((t) => t.id === selectedTodoId) || null;
  }, [todos, selectedTodoId]);

  return {
    todos,
    filteredTodos,
    status,
    hasNextPage,
    refObserver: ref,
    selectedTodoId,
    isDialogOpen,
    handleOpenDialog,
    selectedTodo,
    handleConfirm,
    setIsDialogOpen,
    searchTerm,
  };
};
