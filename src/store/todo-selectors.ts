import { createSelector } from '@reduxjs/toolkit';

import { RootState } from './index';

// 🔹 Selectors
export const selectTodos = (state: RootState) => state.todos.todos;

export const selectActiveTodos = createSelector([selectTodos], (todos) =>
  todos.filter((t) => !t.completed)
);

export const selectCompletedTodos = createSelector([selectTodos], (todos) =>
  todos.filter((t) => t.completed)
);
