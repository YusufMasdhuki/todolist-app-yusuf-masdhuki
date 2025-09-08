'use client';
import { ListFilter } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

import { AppDispatch, RootState } from '@/store';
import { setFilter } from '@/store/filter-slice';

const SearchBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchTerm, priority } = useSelector(
    (state: RootState) => state.filter
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilter({ search: e.target.value, priority }));
  };

  const handlePriorityChange = (value: 'all' | 'low' | 'medium' | 'high') => {
    dispatch(setFilter({ search: searchTerm, priority: value }));
  };

  return (
    <div className='mb-5 flex w-full items-center gap-3'>
      <div className='flex h-12 w-full items-center gap-2 rounded-2xl border px-4'>
        <input
          type='text'
          placeholder='Search'
          value={searchTerm}
          onChange={handleSearchChange}
          className='w-full rounded-md p-2 outline-none'
        />
      </div>

      <Select value={priority} onValueChange={handlePriorityChange}>
        <SelectTrigger className='flex !h-12 min-w-[102px] items-center justify-center gap-2 rounded-2xl px-3'>
          <ListFilter />
          {priority === 'all'
            ? 'Priority'
            : priority.charAt(0).toUpperCase() + priority.slice(1)}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All</SelectItem>
          <SelectItem value='low'>Low</SelectItem>
          <SelectItem value='medium'>Medium</SelectItem>
          <SelectItem value='high'>High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchBar;
