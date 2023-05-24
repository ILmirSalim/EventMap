import { configureStore } from '@reduxjs/toolkit';
import eventReducer from '../slices/eventSlice'
import authReducer from '../slices/authSlice'

const store = configureStore({
  reducer: {
    event: eventReducer,
    auth: authReducer,
  },
});

export default store;

