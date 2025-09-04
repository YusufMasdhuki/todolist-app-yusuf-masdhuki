// hooks/useTodoTabs.ts
'use client';

import { useEffect, useMemo, useState } from 'react';

import { useInfiniteTodos } from '@/hooks/use-infinite-todos';

export function useTodoTabs(todayDate: Date) {
  const allQuery = useInfiniteTodos({ sort: 'date', order: 'asc' });

  // Data asli
  const todos = useMemo(
    () =>
      allQuery.data?.pages.flatMap((p) => p.todos).filter((t) => t?.id) || [],
    [allQuery.data]
  );

  // Local state toggle
  const [localTodos, setLocalTodos] = useState<Record<string, boolean>>({});

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

  // Derived states
  const todayTodos = useMemo(
    () =>
      todos.filter((todo) => {
        if (!todo.date || localTodos[todo.id]) return false;
        const d = new Date(todo.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === todayDate.getTime();
      }),
    [todos, localTodos, todayDate]
  );

  const upcomingTodos = useMemo(
    () =>
      todos.filter((todo) => {
        if (!todo.date || localTodos[todo.id]) return false;
        const d = new Date(todo.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() !== todayDate.getTime();
      }),
    [todos, localTodos, todayDate]
  );

  const completedTodos = useMemo(
    () => todos.filter((todo) => localTodos[todo.id]),
    [todos, localTodos]
  );

  return {
    allQuery,
    localTodos,
    handleToggle,
    todayTodos,
    upcomingTodos,
    completedTodos,
  };
}
