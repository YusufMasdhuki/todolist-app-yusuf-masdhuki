'use client';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { AddTaskDialogProps } from '@/interfaces/AddTaskDialogProps';
import { taskSchema } from '@/schemas/task-schema';
import { createTodo, updateTodo } from '@/services/service';
import { AppDispatch, RootState } from '@/store';
import { closeAddTaskModal } from '@/store/todo-slice';
import { fetchTodos } from '@/store/todo-thunks';

export const useAddTaskForm = ({
  selectedDate,
  fetchQuery,
}: AddTaskDialogProps) => {
  const [errors, setErrors] = useState<{
    title?: string;
    priority?: string;
    date?: string;
  }>({});

  const dispatch = useDispatch<AppDispatch>();
  const { isAddTaskOpen, todoToEdit } = useSelector(
    (state: RootState) => state.todos
  );

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | null>(
    null
  );
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);

  useEffect(() => {
    if (todoToEdit) {
      setTitle(todoToEdit.title);
      setPriority(todoToEdit.priority);
      setDate(dayjs(todoToEdit.date));
    } else {
      setTitle('');
      setPriority(null); // kosong saat add task
      setDate(null);
    }
  }, [todoToEdit, selectedDate]);

  useEffect(() => {
    if (!isAddTaskOpen) {
      setTitle('');
      setPriority(null); // reset priority
      setDate(null);
    }
  }, [isAddTaskOpen]);

  useEffect(() => {
    if (isAddTaskOpen) {
      setErrors({}); // reset error setiap kali buka dialog (add/edit)
    }
  }, [isAddTaskOpen, todoToEdit]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      // Validasi pakai Zod
      const result = taskSchema.safeParse({
        title,
        priority,
        date: date ? date.toDate() : null, // aman walau null
      });

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof typeof fieldErrors;
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }

      // ✅ Pakai alias biar gak shadowing state
      const {
        title: safeTitle,
        priority: safePriority,
        date: safeDate,
      } = result.data;

      // Clear error kalau valid
      setErrors({});

      const dateISO = dayjs(safeDate).startOf('day').toISOString();

      try {
        if (todoToEdit) {
          await updateTodo(todoToEdit.id, {
            title: safeTitle,
            completed: todoToEdit.completed,
            date: dateISO,
            priority: safePriority,
          });
          toast.success('Task updated successfully');
        } else {
          await createTodo({
            title: safeTitle,
            completed: false,
            date: dateISO,
            priority: safePriority,
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
    },
    [title, priority, date, todoToEdit, dispatch, fetchQuery]
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        dispatch(closeAddTaskModal());
      }
    },
    [dispatch]
  );

  const isEdit = !!todoToEdit;

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
    errors,
    isEdit,
    todoToEdit,
  };
};
