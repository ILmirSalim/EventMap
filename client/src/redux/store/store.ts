import { configureStore } from '@reduxjs/toolkit';
import eventReducer, { EventState } from '../slices/eventSlice';
import authReducer, { AuthState } from '../slices/userSlice';

export interface RootState {
  event: EventState;
  auth: AuthState;
  events: EventState
}

const store = configureStore({
  reducer: {
    event: eventReducer,
    auth: authReducer,
  },
});

export type AppDispatch = typeof store.dispatch
export default store;