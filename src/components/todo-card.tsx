'use client';

import clsx from 'clsx';
import { Ellipsis, Loader2 } from 'lucide-react';
import Image from 'next/image';

import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Pencil from './icons/pencil';
import Loader3Dots from './ui/Loader3Dots ';

interface TodoCardProps {
  todo: {
    id: string;
    title: string;
    date: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    completed: boolean;
    isUpdating?: boolean; // untuk animasi loading
  };
  onToggle: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const TodoCard = ({
  todo,
  onToggle,
  onEdit,
  onDelete,
}: TodoCardProps) => {
  const priorityColors: Record<string, string> = {
    LOW: 'bg-accent-green text-white',
    MEDIUM: 'bg-accent-yellow text-black',
    HIGH: 'bg-accent-red text-white',
  };

  return (
    <div className='relative flex h-20 items-center gap-4 rounded-2xl border border-[#DEDCDC] bg-neutral-50 px-3 transition-opacity md:h-21.5 dark:border-neutral-900 dark:bg-neutral-950'>
      <Checkbox
        checked={todo.completed}
        disabled={todo.isUpdating}
        onCheckedChange={() => !todo.isUpdating && onToggle(todo.id)}
        className='data-[state=checked]:bg-primary-100 dark:data-[state=checked]:bg-primary-100 data-[state=checked]:border-primary-100 size-6 cursor-pointer rounded-md border-1 border-[#DEDCDC] dark:border-neutral-900'
      />

      <div className='flex w-full flex-col items-start gap-1'>
        <h3
          className={clsx(
            'md:text-md text-sm font-semibold',
            todo.completed
              ? 'text-neutral-600 line-through dark:text-[#AAAAAA]'
              : 'dark:text-neutral-25 text-neutral-900'
          )}
        >
          {todo.title}
        </h3>

        <div className='flex items-center gap-4.5 md:gap-6.5'>
          <span className='text-xs text-neutral-500 md:text-sm dark:text-neutral-400'>
            {new Date(todo.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>

          <span
            className={`flex h-6 items-center justify-center rounded-md px-2 text-xs font-semibold md:text-sm ${priorityColors[todo.priority]}`}
          >
            {todo.priority.charAt(0) + todo.priority.slice(1).toLowerCase()}
          </span>
        </div>
      </div>

      {/* Dropdown menu / loading indicator */}
      {!todo.completed && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='cursor-pointer rounded p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800'>
              {todo.isUpdating ? (
                <Loader2 className='size-5 animate-spin' />
              ) : (
                <Ellipsis className='size-6' />
              )}
            </button>
          </DropdownMenuTrigger>

          {!todo.isUpdating && (
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                onClick={() => onEdit?.(todo.id)}
                className='flex cursor-pointer items-center gap-2'
              >
                <Pencil />
                <span>Edit</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onDelete?.(todo.id)}
                className='flex cursor-pointer items-center gap-2 text-red-600 focus:text-red-600'
              >
                <Image
                  src='/icons/delete-icon.svg'
                  alt='delete'
                  width={20}
                  height={20}
                />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      )}

      {todo.isUpdating && (
        <div className='absolute inset-0 flex items-center justify-center rounded-2xl bg-white/50 backdrop-blur-2xl dark:bg-neutral-900/50'>
          <Loader3Dots />
        </div>
      )}
    </div>
  );
};
