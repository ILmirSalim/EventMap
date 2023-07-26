export default interface Event {
    userCreatedEvent: string
    _id: string;
    title: string,
    description: string,
    locationType: string,
    address: string,
    day: Date,
    time: string,
    category: string,
    coordinates: [number, number];
  }