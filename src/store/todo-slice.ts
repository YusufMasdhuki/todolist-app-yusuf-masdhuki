'use client';

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import {
  GetTodosParams,
  GetTodosResponse,
  TodoItem,
} from '@/interfaces/get-todos-type';
import { getTodos } from '@/services/service';

// Async thunk untuk fetch todos
export const fetchTodos = createAsyncThunk<GetTodosResponse, GetTodosParams>(
  'todos/fetchTodos',
  async (params) => {
    const data = await getTodos(params);
    return data;
  }
);

interface TodoState {
  todos: TodoItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  selectedDate: string;
  filter: {
    completed?: boolean;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    keyword?: string;
  };
  isAddTaskOpen: boolean; // modal open/close
  addTaskForm: {
    // form data
    title: string;
    date: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
  };
}

const initialState: TodoState = {
  todos: [],
  status: 'idle',
  selectedDate: dayjs().format('YYYY-MM-DD'),
  filter: {},
  isAddTaskOpen: false,
  addTaskForm: {
    title: '',
    date: dayjs().format('YYYY-MM-DD'),
    priority: 'LOW',
  },
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setFilter: (state, action: PayloadAction<Partial<TodoState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = action.payload.todos;
      })
      .addCase(fetchTodos.rejected, (state) => {
        state.status = 'failed';
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
} = todoSlice.actions;
export default todoSlice.reducer;
