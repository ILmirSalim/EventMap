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

export const deleteEvent = createAsyncThunk(
  'event/delete',
  async (eventId: string) => {
    console.log('slice', eventId);

    return await eventAPI.deleteEvent(eventId)
  }
)

export const updateEvent = createAsyncThunk(
  'event/update',
  async (newEvent: IEvent) => {
    return await eventAPI.updateEvent(newEvent)
  }
)

export const searchEvents = createAsyncThunk(
  'event/search',
  async (
    { title, category, startDate, endDate, longitude, latitude, distance }: {

      title: string,
      category: string,
      startDate: Date | null,
      endDate: Date | null,
      longitude: number,
      latitude: number,
      distance: number

    }
  ) => {
    return await eventAPI.searchEvents(title, category, startDate, endDate, longitude, latitude, distance);
  }
);

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
      .addCase(searchEvents.pending, (state) => {
        state.status = 'loading';
        state.events = null;
      })
      .addCase(searchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = action.payload;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.status = 'loading';
        state.event = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.event = action.payload;
      })
      .addCase(updateEvent.pending, (state) => {
        state.status = 'loading';
        state.event = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.event = action.payload;
      })
  },
});
// export const { } = eventSlice.actions
export default eventSlice.reducer;
