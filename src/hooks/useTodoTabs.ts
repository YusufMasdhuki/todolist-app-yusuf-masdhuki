'use client';

import dayjs from 'dayjs';
import { useState, useMemo } from 'react';

import { TodoItem } from '@/interfaces/get-todos-scroll-type';

import { useInfiniteTodos } from './use-infinite-todos';

export function useTodosByTab(
  type: 'today' | 'upcoming' | 'completed',
  todayDate: Date
) {
  const query = useInfiniteTodos({ sort: 'date', order: 'asc', limit: 5 });
  const [localTodos, setLocalTodos] = useState<Record<string, boolean>>({});

  const todos: TodoItem[] = useMemo(() => {
    return (
      query.data?.pages
        .flatMap((p) => p.todos)
        .filter((t): t is TodoItem => {
          if (!t?.id) return false;

          // ambil status completed dari local override dulu
          const isCompleted = localTodos[t.id] ?? t.completed;

          // bandingkan tanggal dengan day.js
          const isToday = dayjs(t.date).isSame(todayDate, 'day');

          if (type === 'today') return isToday && !isCompleted;
          if (type === 'upcoming') return !isToday && !isCompleted;
          if (type === 'completed') return isCompleted;
          return false;
        }) || []
    );
  }, [query.data, localTodos, type, todayDate]);

  const handleToggle = (id: string) => {
    setLocalTodos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return {
    query,
    todos,
    localTodos,
    handleToggle,
  };
}
