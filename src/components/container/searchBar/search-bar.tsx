'use client';
import { ListFilter, Search } from 'lucide-react';
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
    <div className='mb-4 flex w-full items-center gap-2 md:mb-5 md:gap-3'>
      <div className='flex h-11 w-full items-center gap-1 rounded-2xl border px-4 md:h-12 md:gap-2.5'>
        <Search className='size-5 text-[#414651] md:size-6 dark:text-neutral-200' />
        <input
          type='text'
          placeholder='Search'
          value={searchTerm}
          onChange={handleSearchChange}
          className='w-full rounded-md text-sm outline-none'
        />
      </div>

      <Select value={priority} onValueChange={handlePriorityChange}>
        <SelectTrigger className='flex !h-11 w-11 items-center justify-center gap-3 rounded-2xl px-3 shadow-none md:!h-12 md:min-w-[102px]'>
          <ListFilter className='dark:text-neutral-25 size-5 text-neutral-950' />
          <span className='hidden md:inline'>
            {priority === 'all'
              ? 'Priority'
              : priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
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
