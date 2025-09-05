'use client';

import clsx from 'clsx';
import { Ellipsis } from 'lucide-react';
import Image from 'next/image';

import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TodoCardProps {
  todo: {
    id: string;
    title: string;
    date: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  checked: boolean;
  onToggle: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const TodoCard = ({
  todo,
  checked,
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
    <div className='flex items-center gap-4 rounded-2xl border border-[#DEDCDC] bg-neutral-50 p-3 dark:border-neutral-900 dark:bg-neutral-950'>
      <Checkbox checked={checked} onCheckedChange={() => onToggle(todo.id)} />
      <div className='flex w-full flex-col items-start gap-2'>
        <h3
          className={clsx(
            'text-md font-semibold',
            checked
              ? 'text-[#AAAAAA] line-through dark:text-neutral-600'
              : 'dark:text-neutral-25 text-neutral-900'
          )}
        >
          {todo.title}
        </h3>
        <div className='flex items-center gap-3'>
          <span
            className={clsx(
              'text-sm',
              checked
                ? 'text-[#AAAAAA] line-through dark:text-neutral-600'
                : 'dark:text-neutral-25 text-neutral-900'
            )}
          >
            {new Date(todo.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span
            className={`rounded-md px-2 py-0.5 text-sm font-semibold ${priorityColors[todo.priority]}`}
          >
            {todo.priority.charAt(0) + todo.priority.slice(1).toLowerCase()}
          </span>
        </div>
      </div>

      {/* Dropdown menu di Ellipsis */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className='cursor-pointer rounded p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800'>
            <Ellipsis className='h-5 w-5' />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            onClick={() => onEdit?.(todo.id)}
            className='flex cursor-pointer items-center gap-2'
          >
            <Image
              src='/icons/edit-icon.svg'
              alt='edit'
              width={20}
              height={20}
            />
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
      </DropdownMenu>
    </div>
  );
};
