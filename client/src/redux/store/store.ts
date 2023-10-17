import { configureStore } from '@reduxjs/toolkit';
import eventReducer from '../slices/eventSlice';
import EventState from '../slices/interfaces/IEventState';
import authReducer from '../slices/userSlice';
import { AuthState } from '../slices/interfaces/IAuthState';

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