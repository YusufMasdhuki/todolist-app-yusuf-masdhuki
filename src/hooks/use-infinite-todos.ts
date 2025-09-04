// hooks/use-infinite-todos.ts
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { GetTodosScrollParams } from '@/interfaces/get-todos-scroll-type';
import { getTodosScroll } from '@/services/service';

export const useInfiniteTodos = (params?: GetTodosScrollParams) => {
  return useInfiniteQuery({
    queryKey: ['todos', params],
    queryFn: ({ pageParam = 0 }) =>
      getTodosScroll({ ...params, nextCursor: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
  });
};
