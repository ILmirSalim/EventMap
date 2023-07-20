export interface Event {
    _id: string;
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
    // coordinates: [number, number];
    users: [],
    rating: number[],
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