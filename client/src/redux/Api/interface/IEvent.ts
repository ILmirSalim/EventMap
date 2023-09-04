export interface Event {
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