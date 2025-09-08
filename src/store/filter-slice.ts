import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Priority = 'all' | 'low' | 'medium' | 'high';

interface FilterState {
  searchTerm: string;
  priority: Priority;
}

const initialState: FilterState = {
  searchTerm: '',
  priority: 'all',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setPriority: (state, action: PayloadAction<Priority>) => {
      state.priority = action.payload;
    },
    setFilter: (
      state,
      action: PayloadAction<{ search: string; priority: Priority }>
    ) => {
      state.searchTerm = action.payload.search;
      state.priority = action.payload.priority;
    },
    resetFilter: () => initialState,
  },
});

export const { setSearchTerm, setPriority, setFilter, resetFilter } =
  filterSlice.actions;

export default filterSlice.reducer;
