import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { EventState } from '../../../CreateEvent/interfaces';
import { RootState } from '../../../../redux/store/store'
const OrganizedEvents: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const email = user!.email

  const { events } = useSelector((state: { event: EventState }) => state.event);
  const organizedEvents = events?.filter(event =>
    event.userCreatedEvent.includes(email)
  )

  return (
    <div className=''>
      {organizedEvents?.map(event => (
        <div key={event._id}>
          <h2>Название события: {event.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default OrganizedEvents;