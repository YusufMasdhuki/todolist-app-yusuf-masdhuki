// components/todo-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export const TodoSkeleton = () => {
  return (
    <div className='flex items-center gap-2 rounded border p-2 shadow-sm'>
      <Skeleton className='h-5 w-5 rounded' />
      <Skeleton className='h-5 w-40' />
      <Skeleton className='ml-auto h-4 w-16' />
    </div>
  );
};
