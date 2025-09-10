'use client';

import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';

import { priorityMap } from '@/lib/priority-map';
import { errorToast, successToast } from '@/lib/toast-helper';
import { AppDispatch, RootState } from '@/store';
import { fetchTodos, toggleTodoCompleted } from '@/store/todo-thunks';

export const useTodayTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 🔹 ambil state Redux
  const { todos, status, page, hasNextPage } = useSelector(
    (state: RootState) => state.todos
  );
  const { searchTerm, priority } = useSelector(
    (state: RootState) => state.filter
  );

  const { ref, inView } = useInView({ threshold: 0 });

  // 🔹 Fetch todos untuk hari ini
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
          priority: priority !== 'all' ? priorityMap[priority] : undefined,
        })
      );
    },
    [dispatch, priority]
  );

  // 🔹 Fetch awal
  useEffect(() => {
    fetchTodosForToday(1);
  }, [fetchTodosForToday]);

  // 🔹 Infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && status !== 'loading') {
      fetchTodosForToday(page + 1);
    }
  }, [inView, hasNextPage, page, status, fetchTodosForToday]);

  // 🔹 Filter search lokal
  const filteredTodos = useMemo(() => {
    if (!searchTerm) return todos;
    return todos.filter((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [todos, searchTerm]);

  // 🔹 Buka dialog
  const handleOpenDialog = useCallback((id: string) => {
    setSelectedTodoId(id);
    setIsDialogOpen(true);
  }, []);

  // 🔹 Konfirmasi toggle complete
  const handleConfirm = useCallback(() => {
    if (!selectedTodoId) return;

    dispatch(toggleTodoCompleted({ id: selectedTodoId }))
      .unwrap()
      .then(() => successToast('Todo completed!'))
      .catch(() => errorToast('Failed to update todo'))
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
    searchTerm,
  };
};
