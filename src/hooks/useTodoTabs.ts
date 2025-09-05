'use client';

import { useEffect, useMemo, useState } from 'react';

import { useInfiniteTodos } from '@/hooks/use-infinite-todos';
import { TodoItem } from '@/interfaces/get-todos-scroll-type';

export function useTodoTabs(todayDate: Date) {
  const allQuery = useInfiniteTodos({ sort: 'date', order: 'asc' });

  const [localTodos, setLocalTodos] = useState<Record<string, boolean>>({});

  // Memoized todos, pastikan typed
  const todos: TodoItem[] = useMemo(
    () =>
      allQuery.data?.pages
        .flatMap((p) => p.todos)
        .filter((t): t is TodoItem => !!t?.id) || [],
    [allQuery.data]
  );

  useEffect(() => {
    if (todos.length === 0) return;

    setLocalTodos((prev) => {
      const updated = { ...prev };
      let changed = false;

      todos.forEach((t) => {
        if (!(t.id in updated)) {
          updated[t.id] = t.completed;
          changed = true;
        }
      });

      return changed ? updated : prev;
    });
  }, [todos]);

  const handleToggle = (id: string) => {
    setLocalTodos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const todayTodos = todos.filter((todo) => {
    if (!todo.date || localTodos[todo.id]) return false;
    const d = new Date(todo.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === todayDate.getTime();
  });

  const upcomingTodos = todos.filter((todo) => {
    if (!todo.date || localTodos[todo.id]) return false;
    const d = new Date(todo.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() !== todayDate.getTime();
  });

  const completedTodos = todos.filter((todo) => localTodos[todo.id]);

  return {
    allQuery,
    localTodos,
    handleToggle,
    todayTodos,
    upcomingTodos,
    completedTodos,
  };
}
