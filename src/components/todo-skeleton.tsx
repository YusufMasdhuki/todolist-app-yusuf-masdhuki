// components/todo-skeleton.tsx
import { Ellipsis } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';

export const TodoSkeleton = () => {
  return (
    <div className='flex h-[86px] items-center justify-between gap-3 rounded-2xl border border-[#DEDCDC] bg-neutral-50 p-3 dark:border-neutral-900 dark:bg-neutral-950'>
      <div className='flex items-center gap-3'>
        <Skeleton className='h-5 w-5 rounded border border-neutral-400 bg-white' />
        <div>
          <Skeleton className='mb-2 h-5 w-[314px] rounded-full bg-[#DEDCDC]' />
          <Skeleton className='h-5 w-[220px] rounded-full bg-[#DEDCDC]' />
        </div>
      </div>
      <Ellipsis className='size-6' />
    </div>
  );
};
