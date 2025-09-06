'use client';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { TodoItem } from '@/interfaces/get-todos-type';
import { createTodo, updateTodo } from '@/services/service';
import { AppDispatch, RootState } from '@/store';
import { closeAddTaskModal } from '@/store/todo-slice';
import { fetchTodos } from '@/store/todo-thunks';

interface AddTaskDialogProps {
  selectedDate: Dayjs;
  todoToEdit?: TodoItem;
  fetchQuery?: Parameters<typeof fetchTodos>[0]; // opsional query untuk fetch ulang setelah submit
}

const AddTaskDialog = ({ selectedDate, fetchQuery }: AddTaskDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAddTaskOpen, todoToEdit } = useSelector(
    (state: RootState) => state.todos
  );

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
  const [date, setDate] = useState(selectedDate);

  // isi form jika edit
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

  const handleSubmit = async () => {
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
        dispatch(fetchTodos(fetchQuery)); // misal TodayTab pakai dateGte/dateLte hari ini
      } else {
        dispatch(fetchTodos({ page: 1 })); // fallback
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save task');
    }
  };

  return (
    <Dialog
      open={isAddTaskOpen}
      onOpenChange={(open) => !open && dispatch(closeAddTaskModal())}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{todoToEdit ? 'Edit Task' : 'Add Task'}</DialogTitle>
        </DialogHeader>

        <div className='mt-2 flex flex-col gap-4'>
          <Input
            placeholder='Task title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            type='date'
            value={date.format('YYYY-MM-DD')}
            onChange={(e) => setDate(dayjs(e.target.value))}
          />

          <Select
            value={priority}
            onValueChange={(value) =>
              setPriority(value as 'LOW' | 'MEDIUM' | 'HIGH')
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select priority' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='LOW'>Low</SelectItem>
              <SelectItem value='MEDIUM'>Medium</SelectItem>
              <SelectItem value='HIGH'>High</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleSubmit}>
            {todoToEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
