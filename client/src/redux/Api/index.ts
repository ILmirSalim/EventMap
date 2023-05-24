import axios, { AxiosResponse } from 'axios';

interface Event {
    id: string;
    name: string;
    date: string;
    description: string;
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
}
