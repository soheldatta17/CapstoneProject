import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mockEvents, Event } from "@/data/mockData";

interface EventsState {
  items: Event[];
  searchQuery: string;
  filterStatus: string;
}

const initialState: EventsState = {
  items: mockEvents,
  searchQuery: "",
  filterStatus: "all",
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setFilterStatus(state, action: PayloadAction<string>) {
      state.filterStatus = action.payload;
    },
    addEvent(state, action: PayloadAction<Event>) {
      state.items.unshift(action.payload);
    },
    updateEvent(state, action: PayloadAction<Event>) {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteEvent(state, action: PayloadAction<string>) {
      state.items = state.items.filter((e) => e.id !== action.payload);
    },
  },
});

export const { setSearchQuery, setFilterStatus, addEvent, updateEvent, deleteEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
