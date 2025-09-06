import { configureStore } from '@reduxjs/toolkit';

import todoReducer from './todo-slice';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

// Types biar gampang dipakai di useSelector & useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
