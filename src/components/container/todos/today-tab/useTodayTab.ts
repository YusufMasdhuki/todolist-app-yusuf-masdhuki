'use client';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { priorityMap } from '@/lib/priority-map';
import { AppDispatch, RootState } from '@/store';
import { fetchTodos, toggleTodoCompleted } from '@/store/todo-thunks';

import { TodayTabProps } from './helper';

export const useTodayTab = ({ searchTerm, priorityFilter }: TodayTabProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { todos, status, page, hasNextPage } = useSelector(
    (state: RootState) => state.todos
  );
  const { ref, inView } = useInView({ threshold: 0 });

  // Fungsi helper untuk fetch todos hari ini
  const fetchTodosForToday = useCallback(
    (pageToFetch = 1) => {
      const startOfDay = dayjs().startOf('day').toISOString();
      const endOfDay = dayjs().endOf('day').toISOString();

      dispatch(
        fetchTodos({
          completed: false,
          dateGte: startOfDay,
          dateLte: endOfDay,
          page: pageToFetch,
          priority:
            priorityFilter !== 'all' ? priorityMap[priorityFilter] : undefined,
        })
      );
    },
    [dispatch, priorityFilter]
  );

  // Fetch awal
  useEffect(() => {
    fetchTodosForToday(1);
  }, [fetchTodosForToday]);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && status !== 'loading') {
      fetchTodosForToday(page + 1);
    }
  }, [inView, hasNextPage, page, status, fetchTodosForToday]);

  // Filter search lokal
  const filteredTodos = useMemo(() => {
    if (!searchTerm) return todos;
    return todos.filter((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [todos, searchTerm]);

  // Buka dialog
  const handleOpenDialog = useCallback((id: string) => {
    setSelectedTodoId(id);
    setIsDialogOpen(true);
  }, []);

  // Konfirmasi
  const handleConfirm = useCallback(() => {
    if (!selectedTodoId) return;

    dispatch(toggleTodoCompleted({ id: selectedTodoId }))
      .unwrap()
      .then(() => toast.success('Todo completed!'))
      .catch(() => toast.error('Failed to update todo'))
      .finally(() => {
        setSelectedTodoId(null);
        setIsDialogOpen(false);
      });
  }, [dispatch, selectedTodoId]);

  const selectedTodo = useMemo(
    () => todos.find((t) => t.id === selectedTodoId) || null,
    [todos, selectedTodoId]
  );

  return {
    todos,
    filteredTodos,
    status,
    hasNextPage,
    refObserver: ref,
    page,
    handleOpenDialog,
    isDialogOpen,
    setIsDialogOpen,
    handleConfirm,
    selectedTodo,
    selectedTodoId,
  };
};
