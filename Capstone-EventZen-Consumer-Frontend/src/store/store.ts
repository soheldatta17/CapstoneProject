import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authSlice from "./slices/authSlice";
import eventsSlice from "./slices/eventsSlice";
import bookingsSlice from "./slices/bookingsSlice";
import venuesSlice from "./slices/venuesSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    events: eventsSlice,
    bookings: bookingsSlice,
    venues: venuesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
