'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import { TodoState } from '@/interfaces/todo-state-type';

import {
  deleteTodoThunk,
  fetchTodos,
  toggleTodoCompleted,
  updateTodoThunk,
} from './todo-thunks';

const initialState: TodoState = {
  todos: [],
  status: 'idle',
  selectedDate: dayjs().format('YYYY-MM-DD'),
  filter: {},
  page: 1,
  hasNextPage: true,
  isAddTaskOpen: false,
  isDateFiltered: false,
  isDeleteOpen: false,
  todoToEdit: null,
  todoToDelete: null,
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
    openDeleteDialog(state, action: PayloadAction<TodoState['todoToDelete']>) {
      state.isDeleteOpen = true;
      state.todoToDelete = action.payload;
    },
    closeDeleteDialog(state) {
      state.isDeleteOpen = false;
      state.todoToDelete = null;
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
    openEditTaskModal: (
      state,
      action: PayloadAction<TodoState['todoToEdit'] | null>
    ) => {
      state.isAddTaskOpen = true;
      state.todoToEdit = action.payload; // bisa null (untuk Add) atau todo (untuk Edit)
    },
    closeEditTaskModal: (state) => {
      state.isAddTaskOpen = false;
      state.todoToEdit = null;
    },
    resetTodoToEdit: (state) => {
      state.todoToEdit = null;
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
          // gabungkan lama + baru, lalu filter unique by id
          const combined = [...state.todos, ...action.payload.todos];
          const unique = Array.from(
            new Map(combined.map((t) => [t.id, t])).values()
          );
          state.todos = unique;
        } else {
          state.todos = action.payload.todos;
        }

        state.page = page;
        state.hasNextPage = action.payload.todos.length > 0;
      })
      .addCase(fetchTodos.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(toggleTodoCompleted.fulfilled, (state, action) => {
        const id = action.meta.arg.id;
        // cari index todo di upcoming
        const idx = state.todos.findIndex((t) => t.id === id);
        if (idx !== -1) {
          // buang dari upcoming list
          state.todos.splice(idx, 1);
        }
      })
      .addCase(updateTodoThunk.fulfilled, (state, action) => {
        const idx = state.todos.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) {
          state.todos[idx] = action.payload; // replace dengan hasil API
        }
      })
      .addCase(deleteTodoThunk.fulfilled, (state, action) => {
        state.todos = state.todos.filter((t) => t.id !== action.payload.id);
      });
  },
});

export const {
  setSelectedDate,
  setFilter,
  openAddTaskModal,
  closeAddTaskModal,
  openEditTaskModal,
  closeEditTaskModal,
  setAddTaskForm,
  resetAddTaskForm,
  setDateFiltered,
  toggleCompletedLocal,
  openDeleteDialog,
  closeDeleteDialog,
  resetTodoToEdit,
} = todoSlice.actions;

export default todoSlice.reducer;
