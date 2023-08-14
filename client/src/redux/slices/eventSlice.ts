import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { eventAPI } from '../Api';
import IEvent from './interface/IEvent'
import IEventState from './interface/IEventState'

const initialState: IEventState = {
  status: 'idle',
  event: null,
  events: []
};

export const addEvent = createAsyncThunk(
  'event/create',
  async (newEvent: IEvent) => {
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
