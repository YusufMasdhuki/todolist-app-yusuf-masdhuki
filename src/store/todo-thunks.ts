import { createAsyncThunk } from '@reduxjs/toolkit';

import { GetTodosParams, GetTodosResponse } from '@/interfaces/get-todos-type';
import {
  UpdateTodoRequest,
  UpdateTodoResponse,
} from '@/interfaces/put-todos-type';
import { deleteTodo, getTodos, updateTodo } from '@/services/service';

import { RootState } from './index';

// UPDATE
export const updateTodoThunk = createAsyncThunk(
  'todos/update',
  async ({ id, data }: { id: string; data: UpdateTodoRequest }) => {
    const res = await updateTodo(id, data);
    return res; // UpdateTodoResponse
  }
);

// DELETE
export const deleteTodoThunk = createAsyncThunk(
  'todos/delete',
  async (id: string) => {
    const res = await deleteTodo(id);
    return res; // DeleteTodoResponse
  }
);

// 🔹 Fetch todos
export const fetchTodos = createAsyncThunk<
  GetTodosResponse,
  GetTodosParams & { page?: number }
>('todos/fetchTodos', async (params) => {
  return await getTodos(params);
});

// 🔹 Toggle completed (API + update state)
export const toggleTodoCompleted = createAsyncThunk<
  UpdateTodoResponse,
  { id: string },
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
