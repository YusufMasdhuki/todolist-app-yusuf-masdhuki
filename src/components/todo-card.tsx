'use client';

import { Checkbox } from '@/components/ui/checkbox';

interface TodoCardProps {
  todo: {
    id: string;
    title: string;
    date: string;
  };
  checked: boolean;
  onToggle: (id: string) => void;
}

export const TodoCard = ({ todo, checked, onToggle }: TodoCardProps) => {
  return (
    <div className='flex items-center gap-2 rounded border p-2 shadow-sm'>
      <Checkbox checked={checked} onCheckedChange={() => onToggle(todo.id)} />
      <div className={checked ? 'text-gray-500 line-through' : ''}>
        {todo.title}
      </div>
      <span className='ml-auto text-xs text-gray-400'>
        {new Date(todo.date).toLocaleDateString()}
      </span>
    </div>
  );
};
