import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import { useState, useRef } from 'react';

import { Input } from '@/components/ui/input';

export interface DateFieldProps {
  date: dayjs.Dayjs | null;
  setDate: (d: dayjs.Dayjs | null) => void;
  error?: string;
  isEdit?: boolean;
}

const DateField: React.FC<DateFieldProps> = ({
  date,
  setDate,
  error,
  isEdit = false,
}) => {
  const [showInput, setShowInput] = useState(isEdit);
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
          onChange={(e) => {
            const val = e.target.value;
            if (!val) {
              setDate(null);
              setShowInput(false); // ⬅️ balik lagi ke mode label
            } else {
              setDate(dayjs(val));
            }
          }}
          className='peer md:text-md !h-11 w-full cursor-text [appearance:textfield] rounded-md border border-[#DEDCDC] px-3 pt-6 pr-10 pb-2 text-sm shadow-none outline-none focus:border-[#DEDCDC] focus:ring-0 md:!h-14 md:pt-7 dark:border-neutral-900 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:opacity-0'
          placeholder=' '
        />
      ) : (
        <div
          className='h-11 w-full cursor-text rounded-md border border-[#DEDCDC] px-3 pt-5 pb-2 md:h-14 dark:border-neutral-900'
          onClick={handleLabelClick}
        />
      )}

      <label
        onClick={handleLabelClick}
        className='md:text-md absolute top-2.5 left-3 text-sm leading-6 text-neutral-500 transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-focus:top-0.5 peer-focus:text-xs peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-xs md:top-3.5 md:peer-focus:top-1 md:peer-[&:not(:placeholder-shown)]:top-1 dark:text-neutral-400'
      >
        Select date
      </label>

      <Calendar
        className='dark:text-neutral-25 pointer-events-auto absolute top-3.5 right-3 h-4 w-4 cursor-pointer text-neutral-950 md:top-5'
        onClick={handleLabelClick}
        aria-label='Open date picker'
      />

      {error && <p className='mt-1 text-xs text-red-500 md:text-sm'>{error}</p>}
    </div>
  );
};

export default DateField;
