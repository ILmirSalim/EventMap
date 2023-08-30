export default interface Event {
  userCreatedEvent: string
  title: string,
  description: string,
  locationType: string,
  address: string,
  day: Date,
  time: string,
  category: string,
  location: {
    coordinates: [number, number],
  }
}
