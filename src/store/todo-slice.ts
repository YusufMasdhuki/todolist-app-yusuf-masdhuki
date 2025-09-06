'use client';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import { GetTodosParams, GetTodosResponse } from '@/interfaces/get-todos-type';
import { UpdateTodoResponse } from '@/interfaces/put-todos-type';
import { TodoState } from '@/interfaces/todo-state-type';
import { getTodos, updateTodo } from '@/services/service';

import { RootState } from './index';

// Fetch todos
export const fetchTodos = createAsyncThunk<
  GetTodosResponse,
  GetTodosParams & { page?: number }
>('todos/fetchTodos', async (params) => {
  return await getTodos(params);
});

// Toggle completed (API + update state lokal)
export const toggleTodoCompleted = createAsyncThunk<
  UpdateTodoResponse,
  { id: string; completed?: boolean },
  { state: RootState }
>('todos/toggleCompleted', async ({ id }, { getState }) => {
  const state = getState();
  const todo = state.todos.todos.find((t) => t.id === id);
  if (!todo) throw new Error('Todo not found');

  const updated = await updateTodo(id, {
    title: todo.title,
    date: todo.date,
    priority: todo.priority,
    completed: !todo.completed,
  });

  return updated;
});

const initialState: TodoState = {
  todos: [],
  status: 'idle',
  selectedDate: dayjs().format('YYYY-MM-DD'),
  filter: {},
  page: 1,
  hasNextPage: true,
  isAddTaskOpen: false,
  isDateFiltered: false,
  addTaskForm: {
    title: '',
    date: dayjs().format('YYYY-MM-DD'),
    priority: 'LOW',
  },
};

// 🔑 helper untuk filter unique by id
function uniqueTodos(todos: typeof initialState.todos) {
  return Array.from(new Map(todos.map((t) => [t.id, t])).values());
}

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
      state.page = 1;
      state.todos = [];
      state.hasNextPage = true;
    },
    setFilter: (state, action: PayloadAction<Partial<TodoState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
      state.page = 1;
      state.todos = [];
      state.hasNextPage = true;
    },
    openAddTaskModal: (state) => {
      state.isAddTaskOpen = true;
    },
    closeAddTaskModal: (state) => {
      state.isAddTaskOpen = false;
    },
    setAddTaskForm: (
      state,
      action: PayloadAction<Partial<TodoState['addTaskForm']>>
    ) => {
      state.addTaskForm = { ...state.addTaskForm, ...action.payload };
    },
    resetAddTaskForm: (state) => {
      state.addTaskForm = {
        title: '',
        date: state.selectedDate,
        priority: 'LOW',
      };
    },
    toggleCompletedLocal: (state, action: PayloadAction<{ id: string }>) => {
      const todo = state.todos.find((t) => t.id === action.payload.id);
      if (todo) todo.completed = !todo.completed;
    },
    setDateFiltered: (state, action: PayloadAction<boolean>) => {
      state.isDateFiltered = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const page = action.meta.arg.page || 1;

        if (page > 1) {
          state.todos = uniqueTodos([...state.todos, ...action.payload.todos]);
        } else {
          state.todos = uniqueTodos(action.payload.todos);
        }

        state.page = page;
        state.hasNextPage = action.payload.todos.length > 0;
      })
      .addCase(fetchTodos.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(toggleTodoCompleted.fulfilled, (state, action) => {
        const updated = action.payload;

        if (updated.completed) {
          // kalau jadi completed → hapus dari list
          state.todos = state.todos.filter((t) => t.id !== updated.id);
        } else {
          // kalau undo completed → replace/insert
          state.todos = uniqueTodos([updated, ...state.todos]);
        }
      });
  },
});

export const {
  setSelectedDate,
  setFilter,
  openAddTaskModal,
  closeAddTaskModal,
  setAddTaskForm,
  resetAddTaskForm,
  setDateFiltered,
  toggleCompletedLocal,
} = todoSlice.actions;

export default todoSlice.reducer;
