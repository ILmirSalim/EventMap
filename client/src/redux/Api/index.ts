import axios, { AxiosResponse } from 'axios';
import { apiServer } from '../../constants';
import { Event } from './interface/IEvent';

export const eventAPI = {
  // async createEvent(newEvent: Event): Promise<Event> {
  //   try {
  //     const response: AxiosResponse<Event> = await axios.post<Event>(`${apiServer}/newevent`, newEvent);
  //     return response.data;
  //   } catch (err) {
  //     console.log(err);
  //     throw new Error('Failed to create event');
  //   }
  // },
  async createEvent(formData: FormData): Promise<Event> {
    console.log('formdata', formData);
    
    try {
      const response: AxiosResponse<Event> = await axios.post<Event>(
        `${apiServer}/newevent`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to create event');
    }
  },
  async getAllEvents(): Promise<Event[]> {
    try {
      const response: AxiosResponse<Event[]> = await axios.get<Event[]>(`${apiServer}/events`);
      return response.data;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to get all events');
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
        `${apiServer}/search`,
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
      throw new Error('Failed to search events');
    }
  },
  async deleteEvent(eventId: any): Promise<Event> {
    try {
      const response: AxiosResponse<Event> = await axios.delete<Event>(`${apiServer}/deleteEvent`, { data: { eventId } });
      return response.data;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to delete event');
    }
  },

  async updateEvent(event: Event): Promise<Event> {
    try {
      const response: AxiosResponse<Event> = await axios.put<Event>(`${apiServer}/updateEvent`, event);
      return response.data;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to update event');
    }
  },
}
