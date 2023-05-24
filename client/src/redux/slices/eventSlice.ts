import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { eventAPI } from '../Api';

interface EventState {
  status: 'idle' | 'loading' | 'succeeded';
  event: Event | null;
}

interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
}

const initialState: EventState = {
  status: 'idle',
  event: null,
};
export const addEvent = createAsyncThunk(
    'event/create',
    async (newEvent:Event) => {
      return await eventAPI.createEvent(newEvent)
    }
  )

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
      builder
        .addCase(addEvent.pending, (state) => {
          state.status = 'loading';
          state.event = null;
        })
        .addCase(addEvent.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.event = action.payload || null;
        })
    },
});

export const { } = eventSlice.actions
export default eventSlice.reducer;
