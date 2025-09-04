'use client';

import { ListFilter, Search } from 'lucide-react';
import React from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

const SearchBar = () => {
  return (
    <div className='mb-5 flex w-full items-center gap-3'>
      {/* Search Input */}
      <div className='flex h-12 w-full items-center gap-2 rounded-2xl border border-[#DEDCDC] px-4 dark:border-neutral-900'>
        <Search className='size-6' />
        <input
          type='text'
          placeholder='Search'
          className='w-full rounded-md p-2 outline-none'
        />
      </div>

      {/* Priority Dropdown */}
      <div className='flex h-12 items-center justify-center rounded-2xl border border-[#DEDCDC] dark:border-neutral-900'>
        <Select defaultValue='all'>
          <SelectTrigger className='relative w-[100px] border-none bg-transparent px-3 text-sm shadow-none focus:ring-0'>
            <ListFilter className='size-4.5' />
            {/* Teks tetap */}
            <span className='block w-full text-center'>Priority</span>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            <SelectItem value='low'>Low</SelectItem>
            <SelectItem value='medium'>Medium</SelectItem>
            <SelectItem value='high'>High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchBar;
