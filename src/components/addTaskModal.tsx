import dayjs from 'dayjs';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

import { useAddTaskForm } from '@/hooks/useAddTaskForm';
import { AddTaskDialogProps } from '@/interfaces/AddTaskDialogProps';

import DateField from './container/date-field';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';

const AddTaskDialog = ({ selectedDate, fetchQuery }: AddTaskDialogProps) => {
  const [open, setOpen] = useState(false);

  const {
    form,
    handleSubmit,
    isAddTaskOpen,
    handleOpenChange,
    isEdit,
    todoToEdit,
  } = useAddTaskForm({ selectedDate, fetchQuery });

  return (
    <Dialog open={isAddTaskOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='gap-4 p-4 sm:max-w-[425px] md:gap-6 md:p-6'>
        <DialogHeader className='items-start text-left'>
          <DialogTitle className='md:text-display-xs dark:text-neutral-25 text-left text-lg font-bold text-neutral-950'>
            {isEdit ? 'Edit Task' : 'Add Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {/* ------------------ Task Title ------------------ */}
          <div className='relative w-full'>
            <Controller
              control={form.control}
              name='title'
              render={({ field, fieldState }) => (
                <>
                  <Textarea
                    {...field}
                    placeholder=' '
                    className='peer md:text-md w-full resize-none overflow-hidden rounded-md border border-[#DEDCDC] bg-transparent px-3 pt-4 pb-2 text-sm shadow-none outline-none focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:border-[#DEDCDC] focus-visible:ring-0 md:pt-5 dark:border-neutral-900 dark:bg-transparent'
                    style={{ minHeight: '6rem' }}
                  />
                  <label className='md:text-md absolute -top-1 left-3 text-sm leading-6 text-neutral-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-xs md:top-3.5 md:peer-focus:top-1 md:peer-[&:not(:placeholder-shown)]:top-1 dark:text-neutral-400'>
                    Enter your task
                  </label>
                  {fieldState.error && (
                    <p className='text-xs text-red-500'>
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* ------------------ Priority ------------------ */}
          <div className='relative w-full'>
            <Controller
              control={form.control}
              name='priority'
              render={({ field, fieldState }) => (
                <>
                  <Select
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                    open={open}
                    onOpenChange={setOpen}
                  >
                    <SelectTrigger className='peer md:text-md flex !h-11 w-full items-center justify-between rounded-md border border-[#DEDCDC] px-3 pt-6 pb-2 text-sm shadow-none focus:ring-0 md:!h-14 dark:border-neutral-900'>
                      <SelectValue placeholder=' ' />
                      <ChevronDown
                        className={`dark:text-neutral-25 mb-4 ml-3 h-4 w-4 text-neutral-950 transition-transform duration-200 ${
                          open ? 'rotate-180' : 'rotate-0'
                        }`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='LOW'>Low</SelectItem>
                      <SelectItem value='MEDIUM'>Medium</SelectItem>
                      <SelectItem value='HIGH'>High</SelectItem>
                    </SelectContent>
                  </Select>
                  <label
                    className={`absolute left-3 text-neutral-500 transition-all duration-200 dark:text-neutral-400 ${
                      field.value
                        ? 'top-0 text-xs md:top-1'
                        : 'md:text-md top-2.5 text-sm leading-6 md:top-3.5'
                    }`}
                  >
                    Select priority
                  </label>
                  {fieldState.error && (
                    <p className='text-xs text-red-500'>
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* ------------------ Date ------------------ */}
          <Controller
            name='date'
            control={form.control}
            render={({ field, fieldState }) => {
              const value = field.value as string | undefined;
              const dateValue = value ? dayjs(value) : null;

              return (
                <DateField
                  date={dateValue}
                  setDate={(d: dayjs.Dayjs | null) =>
                    field.onChange(d ? d.format('YYYY-MM-DD') : '')
                  }
                  error={fieldState.error?.message}
                  isEdit={!!todoToEdit}
                />
              );
            }}
          />

          <Button type='submit'>Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
