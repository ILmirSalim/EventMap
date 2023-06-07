import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { eventAPI } from '../Api';
// import {Event} from '../../pages/CreateEvent/CreateEvent'

export interface EventState {
  status: 'idle' | 'loading' | 'succeeded';
  event: Event | null;
  events: Event[] | null
}

interface Event {
  // id: string;
  title: string,
  description: string,
  locationType: string,
  address: string,
  date: Date ,
  category: string,
  coordinates: [number, number];
}

const initialState: EventState = {
  status: 'idle',
  event: null,
  events: []
};
export const addEvent = createAsyncThunk(
  'event/create',
  async (newEvent: Event) => {
    return await eventAPI.createEvent(newEvent)
  }
)
export const getAllEvents = createAsyncThunk(
  'event/all',
  async () => {
    return await eventAPI.getAllEvents()
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
      .addCase(getAllEvents.pending, (state) => {
        state.status = 'loading';
        state.events = null;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = action.payload || null;
      })
  },
});

// export const { } = eventSlice.actions
export default eventSlice.reducer;
