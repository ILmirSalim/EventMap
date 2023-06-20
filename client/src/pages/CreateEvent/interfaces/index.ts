export interface Event {
    _id: string;
    title: string,
    description: string,
    locationType: string,
    address: string,
    date: Date,
    category: string,
    coordinates: [number, number];
    users: [],
    rating?: number[]
    userCreatedEvent: string
    feedbackUser?: {
      user: string;
      feedback: string;
    }[]
  }

  export interface EventState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    event: Event | null;
    events: Event[] | null;
  }