import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import { useState, useRef } from 'react';

import { Input } from '@/components/ui/input';

export default function DateField({
  date,
  setDate,
  error,
  isEdit = false, // 👈 default false
}: {
  date: dayjs.Dayjs | null;
  setDate: (d: dayjs.Dayjs | null) => void;
  error?: string;
  isEdit?: boolean;
}) {
  const [showInput, setShowInput] = useState(isEdit); // 👈 kalau edit langsung true
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLabelClick = () => {
    setShowInput(true);
    setTimeout(() => {
      inputRef.current?.showPicker?.();
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <div className='relative w-full'>
      {showInput ? (
        <Input
          ref={inputRef}
          type='date'
          value={date ? date.format('YYYY-MM-DD') : ''}
          onChange={(e) =>
            setDate(e.target.value ? dayjs(e.target.value) : null)
          }
          className='peer h-14 w-full cursor-text [appearance:textfield] rounded-md border border-[#DEDCDC] px-3 pt-5 pr-10 pb-2 shadow-none outline-none focus:border-[#DEDCDC] focus:ring-0 dark:border-neutral-900 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:opacity-0'
          placeholder=' '
        />
      ) : (
        <div
          className='h-14 w-full cursor-text rounded-md border border-[#DEDCDC] px-3 pt-5 pb-2 dark:border-neutral-900'
          onClick={handleLabelClick}
        />
      )}

      <label
        onClick={handleLabelClick}
        className='absolute top-3.5 left-3 text-sm text-gray-400 transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-gray-500 peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-gray-500'
      >
        Select date
      </label>

      <Calendar
        className='pointer-events-auto absolute top-4 right-3 h-5 w-5 cursor-pointer text-gray-400'
        onClick={handleLabelClick}
        aria-label='Open date picker'
      />

      {error && <p className='mt-1 text-xs text-red-500'>{error}</p>}
    </div>
  );
}
