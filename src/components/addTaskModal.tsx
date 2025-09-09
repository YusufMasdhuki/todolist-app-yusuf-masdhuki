'use client';

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

import DateField from './container/date-field';
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
    errors,
    isEdit,
    todoToEdit,
  } = useAddTaskForm({ selectedDate, fetchQuery });

  return (
    <Dialog open={isAddTaskOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='gap-6 p-6 sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-display-xs dark:text-neutral-25 font-bold text-neutral-950'>
            {isEdit ? 'Edit Task' : 'Add Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {/* ------------------ Task Title ------------------ */}
          <div className='relative w-full'>
            <Textarea
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              placeholder=' '
              className='peer w-full resize-none overflow-hidden rounded-md border border-[#DEDCDC] bg-transparent px-3 pt-5 pb-2 text-sm shadow-none outline-none focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:border-[#DEDCDC] focus-visible:ring-0 dark:border-neutral-900 dark:bg-transparent'
              style={{ minHeight: '6rem' }}
            />
            <label className='absolute top-5 left-3 text-sm text-gray-400 transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-gray-500 peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-gray-500'>
              Enter your task
            </label>
            {errors.title && (
              <p className='text-xs text-red-500'>{errors.title}</p>
            )}
          </div>

          {/* ------------------ Priority ------------------ */}
          <div className='relative w-full'>
            <Select
              value={priority ?? ''}
              onValueChange={(v) => setPriority(v as 'LOW' | 'MEDIUM' | 'HIGH')}
            >
              <SelectTrigger className='peer !h-14 w-full rounded-md border border-[#DEDCDC] px-3 pt-5 pb-2 shadow-none focus:ring-0 dark:border-neutral-900'>
                <SelectValue placeholder=' ' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='LOW'>Low</SelectItem>
                <SelectItem value='MEDIUM'>Medium</SelectItem>
                <SelectItem value='HIGH'>High</SelectItem>
              </SelectContent>
            </Select>
            <label
              className={`absolute left-3 text-gray-400 transition-all duration-200 ${
                priority
                  ? 'top-1 text-xs text-gray-500'
                  : 'top-3.5 text-sm text-gray-400'
              }`}
            >
              Select priority
            </label>

            {errors.priority && (
              <p className='text-xs text-red-500'>{errors.priority}</p>
            )}
          </div>

          {/* ------------------ Date ------------------ */}
          <DateField
            date={date}
            setDate={setDate}
            error={errors.date}
            isEdit={!!todoToEdit} // 👈 kalau edit langsung tampilkan input
          />

          <Button type='submit'>Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
