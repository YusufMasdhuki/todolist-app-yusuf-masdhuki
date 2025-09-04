import { DeleteTodoResponse } from '@/interfaces/delete-todo-type';
import {
  GetTodosScrollParams,
  GetTodosScrollResponse,
} from '@/interfaces/get-todos-scroll-type';
import { GetTodosParams, GetTodosResponse } from '@/interfaces/get-todos-type';
import { CreateTodoRequest, TodoResponse } from '@/interfaces/post-todos-type';
import {
  UpdateTodoRequest,
  UpdateTodoResponse,
} from '@/interfaces/put-todos-type';

import { api } from './api';

export const createTodo = async (
  data: CreateTodoRequest
): Promise<TodoResponse> => {
  const response = await api.post<TodoResponse>('/todos', data);
  return response.data;
};

export const getTodos = async (
  params?: GetTodosParams
): Promise<GetTodosResponse> => {
  const response = await api.get<GetTodosResponse>('/todos', { params });
  return response.data;
};

export const deleteTodo = async (id: string): Promise<DeleteTodoResponse> => {
  const response = await api.delete<DeleteTodoResponse>(`/todos/${id}`);
  return response.data;
};

export const updateTodo = async (
  id: string,
  data: UpdateTodoRequest
): Promise<UpdateTodoResponse> => {
  const response = await api.put<UpdateTodoResponse>(`/todos/${id}`, data);
  return response.data;
};

export const getTodosScroll = async (
  params?: GetTodosScrollParams
): Promise<GetTodosScrollResponse> => {
  const response = await api.get<GetTodosScrollResponse>('/todos/scroll', {
    params,
  });
  return response.data;
};
