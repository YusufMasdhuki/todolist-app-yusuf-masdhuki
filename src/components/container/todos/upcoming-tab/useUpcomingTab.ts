import { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { TodoItem } from '@/interfaces/get-todos-type';
import { priorityMap } from '@/lib/priority-map';
import { AppDispatch, RootState } from '@/store';
import {
  setDateFiltered,
  setSelectedDate as setSelectedDateRedux,
} from '@/store/todo-slice';
import { fetchTodos, toggleTodoCompleted } from '@/store/todo-thunks';

import { UpcomingTabProps } from './helper';

export const useUpcomingTab = ({
  selectedDate,
  setSelectedDate,
}: UpcomingTabProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, status, page, hasNextPage, isDateFiltered } = useSelector(
    (state: RootState) => state.todos
  );

  const { searchTerm, priority } = useSelector(
    (state: RootState) => state.filter
  );
  const { ref, inView } = useInView({ threshold: 0 });

  // 🔹 State untuk confirm dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);

  // Helper untuk build query
  const buildQuery = useCallback(
    (date?: Dayjs, pageNumber = 1) => ({
      completed: false,
      dateGte: date?.startOf('day').toISOString(),
      dateLte: date?.endOf('day').toISOString(),
      page: pageNumber,
      priority: priority !== 'all' ? priorityMap[priority] : undefined,
    }),
    [priority]
  );

  // Helper fetch todos
  const fetchTodosQuery = useCallback(
    (date?: Dayjs, pageNumber = 1) => {
      dispatch(fetchTodos(buildQuery(date, pageNumber)));
    },
    [dispatch, buildQuery]
  );

  // ⬇️ Reset ke mode "Upcoming" setiap kali masuk tab
  useEffect(() => {
    dispatch(setDateFiltered(false));
    fetchTodosQuery(undefined, 1);
  }, [dispatch, fetchTodosQuery]);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && status !== 'loading') {
      fetchTodosQuery(isDateFiltered ? selectedDate : undefined, page + 1);
    }
  }, [
    inView,
    hasNextPage,
    status,
    page,
    isDateFiltered,
    selectedDate,
    fetchTodosQuery,
  ]);

  const handleOpenDialog = useCallback(
    (id: string) => {
      const todo = todos.find((t) => t.id === id) || null;
      setSelectedTodo(todo);
      setIsDialogOpen(true);
    },
    [todos]
  );

  const handleConfirm = useCallback(() => {
    if (selectedTodo) {
      dispatch(toggleTodoCompleted({ id: selectedTodo.id }))
        .unwrap()
        .then(() => {
          toast.success('Todo selesai!');

          // 🔹 Refetch agar data sesuai filter
          if (isDateFiltered) {
            fetchTodosQuery(selectedDate, 1);
          } else {
            fetchTodosQuery(undefined, 1);
          }
        })
        .catch(() => toast.error('Gagal update todo'));
    }
    setIsDialogOpen(false);
  }, [dispatch, selectedTodo, isDateFiltered, fetchTodosQuery, selectedDate]);

  // Change date → otomatis masuk ke mode filtered
  const handleDateChange = useCallback(
    (date: Dayjs) => {
      dispatch(setDateFiltered(true));
      setSelectedDate?.(date);
      dispatch(setSelectedDateRedux(date.format('YYYY-MM-DD')));
      fetchTodosQuery(date, 1);
    },
    [dispatch, fetchTodosQuery, setSelectedDate]
  );

  // Reset filter → kembali ke mode Upcoming
  const resetFilter = useCallback(() => {
    dispatch(setDateFiltered(false));
    fetchTodosQuery(undefined, 1);
  }, [dispatch, fetchTodosQuery]);

  // Carousel ±10 hari
  const carouselDates = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => selectedDate.add(i - 5, 'day'));
  }, [selectedDate]);

  // Filter by search
  const filteredTodos = useMemo(() => {
    if (!searchTerm) return todos;
    return todos.filter((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [todos, searchTerm]);

  return {
    todos,
    filteredTodos,
    status,
    hasNextPage,
    refObserver: ref,
    isDateFiltered,
    handleOpenDialog,
    handleConfirm,
    setIsDialogOpen,
    isDialogOpen,
    selectedTodo,
    handleDateChange,
    resetFilter,
    carouselDates,
    searchTerm,
  };
};
