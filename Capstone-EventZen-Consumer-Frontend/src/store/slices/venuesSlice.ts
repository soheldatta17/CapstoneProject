import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mockVenues, Venue } from "@/data/mockData";

interface VenuesState {
  items: Venue[];
}

const initialState: VenuesState = {
  items: mockVenues,
};

const venuesSlice = createSlice({
  name: "venues",
  initialState,
  reducers: {
    addVenue(state, action: PayloadAction<Venue>) {
      state.items.unshift(action.payload);
    },
    updateVenue(state, action: PayloadAction<Venue>) {
      const idx = state.items.findIndex((v) => v.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
  },
});

export const { addVenue, updateVenue } = venuesSlice.actions;
export default venuesSlice.reducer;
