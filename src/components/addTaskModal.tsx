'use client';
import dayjs from 'dayjs';

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

import { useAddTaskForm } from '@/hooks/useAddTaskForm';
import { AddTaskDialogProps } from '@/interfaces/AddTaskDialogProps';

const AddTaskDialog = ({ selectedDate, fetchQuery }: AddTaskDialogProps) => {
  const {
    title,
    setTitle,
    priority,
    setPriority,
    date,
    setDate,
    handleSubmit,
    isAddTaskOpen,
    handleOpenChange,
  } = useAddTaskForm({ selectedDate, fetchQuery });

  return (
    <Dialog open={isAddTaskOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{title ? 'Edit Task' : 'Add Task'}</DialogTitle>
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

          <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder='Select priority' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='LOW'>Low</SelectItem>
              <SelectItem value='MEDIUM'>Medium</SelectItem>
              <SelectItem value='HIGH'>High</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleSubmit}>{title ? 'Update' : 'Create'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
