'use client';

import { ListFilter, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

interface SearchBarProps {
  onFilterChange: (filter: { search: string; priority: string }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onFilterChange }) => {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<
    'all' | 'low' | 'medium' | 'high'
  >('all');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return; // jangan trigger sebelum mount
    const delayDebounce = setTimeout(() => {
      onFilterChange({
        search: searchTerm,
        priority: priorityFilter,
      });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, priorityFilter, onFilterChange, mounted]);

  if (!mounted) return null; // jangan render server-side

  return (
    <div className='mb-5 flex w-full items-center gap-3'>
      <div className='flex h-12 w-full items-center gap-2 rounded-2xl border border-[#DEDCDC] px-4 dark:border-neutral-900'>
        <Search className='size-6' />
        <input
          type='text'
          placeholder='Search'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full rounded-md p-2 outline-none'
        />
      </div>

      <div className='flex h-12 items-center justify-center rounded-2xl border border-[#DEDCDC] dark:border-neutral-900'>
        <Select
          value={priorityFilter}
          onValueChange={(value) => {
            if (
              value === 'all' ||
              value === 'low' ||
              value === 'medium' ||
              value === 'high'
            ) {
              setPriorityFilter(value);
            }
          }}
        >
          <SelectTrigger className='relative w-[100px] border-none bg-transparent px-3 text-sm shadow-none focus:ring-0'>
            <ListFilter className='size-4.5' />
            <span className='block w-full text-center'>
              {priorityFilter === 'all'
                ? 'Priority'
                : priorityFilter.charAt(0).toUpperCase() +
                  priorityFilter.slice(1)}
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
    </div>
  );
};

export default SearchBar;
