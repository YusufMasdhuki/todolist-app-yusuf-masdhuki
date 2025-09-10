'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { AddTaskDialogProps } from '@/interfaces/AddTaskDialogProps';
import { errorToast, successToast } from '@/lib/toast-helper';
import { TaskInput, taskSchema } from '@/schemas/task-schema';
import { createTodo, updateTodo } from '@/services/service';
import { AppDispatch, RootState } from '@/store';
import { closeAddTaskModal } from '@/store/todo-slice';
import { fetchTodos } from '@/store/todo-thunks';

export const useAddTaskForm = ({ fetchQuery }: AddTaskDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAddTaskOpen, todoToEdit } = useSelector(
    (state: RootState) => state.todos
  );

  const form = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      priority: undefined,
      date: '', // string kosong
    },
  });

  // Prefill kalau edit
  useEffect(() => {
    if (isAddTaskOpen) {
      if (todoToEdit) {
        // Prefill edit
        form.reset({
          title: todoToEdit.title,
          priority: todoToEdit.priority,
          date: todoToEdit.date
            ? dayjs(todoToEdit.date).format('YYYY-MM-DD')
            : '',
        });
      } else {
        // Reset kosong setiap buka add
        form.reset({
          title: '',
          priority: undefined,
          date: '',
        });
      }
    }
  }, [isAddTaskOpen, todoToEdit, form]);

  // Saat submit
  const handleSubmit = form.handleSubmit(async (data) => {
    const dateISO = dayjs(data.date).startOf('day').toISOString();

    try {
      if (todoToEdit) {
        await updateTodo(todoToEdit.id, {
          title: data.title,
          completed: todoToEdit.completed,
          date: dateISO,
          priority: data.priority,
        });
        successToast('Changes saved');
      } else {
        await createTodo({
          title: data.title,
          completed: false,
          date: dateISO,
          priority: data.priority,
        });
        successToast('Task Added!');
      }

      dispatch(closeAddTaskModal());
      dispatch(fetchTodos(fetchQuery ?? { page: 1 }));
    } catch (err: any) {
      errorToast(err?.response?.data?.message || 'Failed to save task');
    }
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dispatch(closeAddTaskModal());
    }
  };

  return {
    form,
    handleSubmit,
    isAddTaskOpen,
    handleOpenChange,
    isEdit: !!todoToEdit,
    todoToEdit,
  };
};
