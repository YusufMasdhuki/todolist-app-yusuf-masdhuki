import { Dayjs } from 'dayjs';

export interface UpcomingTabProps {
  selectedDate: Dayjs;
  setSelectedDate?: (d: Dayjs) => void;
  searchTerm: string;
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
}
