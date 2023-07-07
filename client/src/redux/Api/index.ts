import axios, { AxiosResponse } from 'axios';

interface Event {
    // id: string;
    title: string,
    description: string,
    locationType: string,
    address: string,
    day: Date,
    time: string,
    category: string,
    coordinates: [number, number];
  }

export const eventAPI = {
    async createEvent(newEvent:Event): Promise<Event> {
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
          console.log(response.data);
          
          return response.data;
        } catch (err) {
          console.log(err);
          throw new Error('Failed to fetch events');
        }
      },

}
