import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mockBookings, Booking } from "@/data/mockData";

interface BookingsState {
  items: Booking[];
}

const initialState: BookingsState = {
  items: mockBookings,
};

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    addBooking(state, action: PayloadAction<Booking>) {
      state.items.unshift(action.payload);
    },
    updateBookingStatus(state, action: PayloadAction<{ id: string; status: Booking["status"] }>) {
      const b = state.items.find((b) => b.id === action.payload.id);
      if (b) b.status = action.payload.status;
    },
    cancelBooking(state, action: PayloadAction<string>) {
      const b = state.items.find((b) => b.id === action.payload);
      if (b) b.status = "cancelled";
    },
  },
});

export const { addBooking, updateBookingStatus, cancelBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;
