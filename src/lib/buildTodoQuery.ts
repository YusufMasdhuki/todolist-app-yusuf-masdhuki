import dayjs, { Dayjs } from 'dayjs';

import { priorityMap } from './priority-map';

interface BuildTodoQueryParams {
  completed: boolean;
  date?: string | Dayjs;
  page?: number;
  priorityFilter?: string;
}

export const buildTodoQuery = ({
  completed,
  date,
  page = 1,
  priorityFilter,
}: BuildTodoQueryParams) => {
  const d = date ? dayjs(date) : null;

  return {
    completed,
    dateGte: d ? d.startOf('day').toISOString() : undefined,
    dateLte: d ? d.endOf('day').toISOString() : undefined,
    page,
    priority:
      priorityFilter && priorityFilter !== 'all'
        ? priorityMap[priorityFilter]
        : undefined,
  };
};
