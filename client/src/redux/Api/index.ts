import axios, { AxiosResponse } from 'axios';

interface Event {

  title: string,
  description: string,
  locationType: string,
  address: string,
  day: Date,
  time: string,
  category: string,
  location: {
    coordinates: [number, number];
  }
  userCreatedEvent: string,
  feedbackUser?: {
    user: string;
    feedback: string;
  }[]
}

export const eventAPI = {
  async createEvent(newEvent: Event): Promise<Event> {
    try {
      const response: AxiosResponse<Event> = await axios.post<Event>('http://localhost:3002/api/newevent', newEvent);
      return response.data;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to create event');
    }
  },
  async getAllEvents(): Promise<Event[]> {
    try {
      const response: AxiosResponse<Event[]> = await axios.get<Event[]>('http://localhost:3002/api/events');

      return response.data;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to fetch events');
    }
  },

  async searchEvents(title: string,
    category: string,
    startDate: Date | null,
    endDate: Date | null,
    longitude: number,
    latitude: number,
    distance: number): Promise<Event[]> {
    try {
      const response: AxiosResponse<Event[]> = await axios.post<Event[]>(
        'http://localhost:3002/api/search',
        {
          title: title,
          category: category,
          startDate: startDate,
          endDate: endDate,
          longitude: longitude,
          latitude: latitude,
          distance: distance
        }
      );
      
      return response.data;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to fetch events');
    }
  },
  async deleteEvent(eventId: any): Promise<Event> {
    try {
      const response: AxiosResponse<Event> = await axios.delete<Event>('http://localhost:3002/api/deleteEvent',  {data: { eventId }});
      
      return response.data;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to create event');
    }
  },

  async updateEvent(event: Event): Promise<Event> {
    try {
      console.log('event', event);
      
      const response: AxiosResponse<Event> = await axios.put<Event>('http://localhost:3002/api/updateEvent',  event );
      
      return response.data;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to create event');
    }
  },
}
