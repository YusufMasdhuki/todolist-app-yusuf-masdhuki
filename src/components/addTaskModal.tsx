'use client';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useState } from 'react';
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

import { createTodo } from '@/services/service';
import { AppDispatch, RootState } from '@/store';
import { closeAddTaskModal, fetchTodos } from '@/store/todo-slice';

interface AddTaskDialogProps {
  selectedDate: Dayjs;
}

const AddTaskDialog = ({ selectedDate }: AddTaskDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector((state: RootState) => state.todos.isAddTaskOpen);

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
  const [date, setDate] = useState(selectedDate); // state untuk tanggal

  const handleSubmit = async () => {
    if (!title.trim()) return toast.error('Title cannot be empty');

    try {
      const dateISO = date.startOf('day').toISOString();

      await createTodo({
        title,
        completed: false,
        date: dateISO,
        priority,
      });

      toast.success('Task added successfully');
      setTitle('');
      setPriority('LOW');
      dispatch(closeAddTaskModal());

      // Refresh todos sesuai tanggal baru
      dispatch(fetchTodos({ dateGte: dateISO, dateLte: dateISO }));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && dispatch(closeAddTaskModal())}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>

        <div className='mt-2 flex flex-col gap-4'>
          {/* Title */}
          <Input
            placeholder='Task title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Date picker */}
          <Input
            type='date'
            value={date.format('YYYY-MM-DD')}
            onChange={(e) => setDate(dayjs(e.target.value))}
          />

          {/* Priority */}
          <Select
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

          <Button onClick={handleSubmit}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
