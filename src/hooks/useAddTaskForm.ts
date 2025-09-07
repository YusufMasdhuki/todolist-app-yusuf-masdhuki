'use client';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { AddTaskDialogProps } from '@/interfaces/AddTaskDialogProps';
import { createTodo, updateTodo } from '@/services/service';
import { AppDispatch, RootState } from '@/store';
import { closeAddTaskModal } from '@/store/todo-slice';
import { fetchTodos } from '@/store/todo-thunks';

export const useAddTaskForm = ({
  selectedDate,
  fetchQuery,
}: AddTaskDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAddTaskOpen, todoToEdit } = useSelector(
    (state: RootState) => state.todos
  );

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
  const [date, setDate] = useState(selectedDate);

  useEffect(() => {
    if (todoToEdit) {
      setTitle(todoToEdit.title);
      setPriority(todoToEdit.priority);
      setDate(dayjs(todoToEdit.date));
    } else {
      setTitle('');
      setPriority('LOW');
      setDate(selectedDate);
    }
  }, [todoToEdit, selectedDate]);

  useEffect(() => {
    if (!isAddTaskOpen) {
      setTitle('');
      setPriority('LOW');
      setDate(selectedDate);
    }
  }, [isAddTaskOpen, selectedDate]);

  const handleSubmit = useCallback(async () => {
    if (!title.trim()) return toast.error('Title cannot be empty');

    const dateISO = date.startOf('day').toISOString();

    try {
      if (todoToEdit) {
        await updateTodo(todoToEdit.id, {
          title,
          completed: todoToEdit.completed,
          date: dateISO,
          priority,
        });
        toast.success('Task updated successfully');
      } else {
        await createTodo({
          title,
          completed: false,
          date: dateISO,
          priority,
        });
        toast.success('Task added successfully');
      }

      dispatch(closeAddTaskModal());

      if (fetchQuery) {
        dispatch(fetchTodos(fetchQuery));
      } else {
        dispatch(fetchTodos({ page: 1 }));
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save task');
    }
  }, [title, priority, date, todoToEdit, dispatch, fetchQuery]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        dispatch(closeAddTaskModal());
      }
    },
    [dispatch]
  );

  return {
    title,
    setTitle,
    priority,
    setPriority,
    date,
    setDate,
    handleSubmit,
    isAddTaskOpen,
    handleOpenChange,
  };
};
