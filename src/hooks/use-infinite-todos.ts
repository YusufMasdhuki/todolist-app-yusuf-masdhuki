// hooks/use-infinite-todos.ts
'use client';

import { InfiniteData } from '@tanstack/react-query';
import { useInfiniteQuery } from '@tanstack/react-query';

import {
  GetTodosScrollParams,
  GetTodosScrollResponse,
} from '@/interfaces/get-todos-scroll-type';
import { getTodosScroll } from '@/services/service';

export const useInfiniteTodos = (params?: GetTodosScrollParams) => {
  return useInfiniteQuery<
    GetTodosScrollResponse,
    Error,
    InfiniteData<GetTodosScrollResponse>,
    [string, GetTodosScrollParams?],
    number
  >({
    queryKey: ['todos', params],
    queryFn: ({ pageParam = 0 }) =>
      getTodosScroll({ ...params, nextCursor: pageParam, limit: 5 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });
};
