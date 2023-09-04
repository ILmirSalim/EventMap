export default interface EventState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    event: Event | null;
    events: Event[] | null;
  }

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
    users: [{
      userId: string,
      userName: string
    }],
    rating: number[],
    userCreatedEvent: string
    feedbackUser?: {
      user: string;
      feedback: string;
    }[]
  }