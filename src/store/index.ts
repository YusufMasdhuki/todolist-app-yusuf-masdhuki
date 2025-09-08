import { configureStore } from '@reduxjs/toolkit';

import filterReducer from './filter-slice';
import todoReducer from './todo-slice';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    filter: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
