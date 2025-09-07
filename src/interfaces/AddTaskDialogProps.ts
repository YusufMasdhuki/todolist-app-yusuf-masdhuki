import { Dayjs } from 'dayjs';

export interface AddTaskDialogProps {
  selectedDate: Dayjs;
  fetchQuery?: Parameters<typeof import('@/store/todo-thunks').fetchTodos>[0];
}
