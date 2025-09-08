'use client';
import dayjs from 'dayjs';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useAddTaskForm } from '@/hooks/useAddTaskForm';
import { AddTaskDialogProps } from '@/interfaces/AddTaskDialogProps';

import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

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
          <DialogTitle className='text-display-xs dark:text-neutral-25 font-bold text-neutral-950'>
            {title ? 'Edit Task' : 'Add Task'}
          </DialogTitle>
        </DialogHeader>

        <div className='mt-4 flex flex-col gap-6'>
          {/* ------------------ Task Title ------------------ */}
          <div className='relative w-full'>
            <Textarea
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                // Auto-expand height
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              className='peer focus:border-primary-500 focus:ring-primary-200 focus:ring-opacity-50 w-full resize-none overflow-hidden rounded-md border border-gray-300 bg-transparent px-3 pt-5 pb-2 text-sm focus:ring'
              style={{ minHeight: '6rem' }} // Optional: tinggi minimum
            />
            <label className='peer-focus:text-primary-500 peer-placeholder-shown:text-md absolute top-1 left-3 text-sm leading-6 text-gray-400 transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-xs'>
              Enter your task
            </label>
          </div>

          {/* ------------------ Priority ------------------ */}
          <div className='h-14 w-full rounded-md border border-[#DEDCDC] px-3'>
            <label
              htmlFor='priority'
              className='text-xs leading-4 text-neutral-400'
            >
              Select priority
            </label>
            <Select
              value={priority}
              onValueChange={(v) => setPriority(v as 'LOW' | 'MEDIUM' | 'HIGH')}
            >
              <SelectTrigger className='!h-6 w-full border-none p-0 shadow-none focus:ring-0'>
                <SelectValue placeholder=' ' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='LOW'>Low</SelectItem>
                <SelectItem value='MEDIUM'>Medium</SelectItem>
                <SelectItem value='HIGH'>High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ------------------ Date ------------------ */}
          <div className='h-14 w-full rounded-md border border-[#DEDCDC] px-3'>
            <label
              htmlFor='date'
              className='text-xs leading-4 text-neutral-400'
            >
              Select date
            </label>
            <Input
              type='date'
              value={date ? date.format('YYYY-MM-DD') : ''}
              onChange={(e) => setDate(dayjs(e.target.value))}
              className='!h-6 w-full border-none p-0 shadow-none outline-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0'
              placeholder=' '
            />
          </div>

          <Button onClick={handleSubmit}>{title ? 'Update' : 'Create'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
