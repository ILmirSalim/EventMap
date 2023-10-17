import {Event} from "./IEvent";

export default interface EventState {
    status: 'idle' | 'loading' | 'succeeded';
    event: Event | null;
    events: Event[] | null
}