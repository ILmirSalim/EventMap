import React from 'react';
import { useSelector } from 'react-redux';
import { EventState } from '../../CreateEvent/interfaces';
import { RootState } from '../../../redux/store/store'
import { Link } from "react-router-dom";
import { wrapperOrgEvents } from './style';

const OrganizedEvents: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const email = user!.email
  const { events } = useSelector((state: { event: EventState }) => state.event);
  
  const organizedEvents = events?.filter(event =>
    event.userCreatedEvent.includes(email)
  )

  return (
    <div className='flex flex-wrap justify-center items-center'>
      {!email && <>Не удалось получить данные о пользователе и его событиях...</>}
      {organizedEvents?.length === 0 && <div>Нет организуемых событий...</div>}
      <div className='flex flex-wrap w-full '>
        {organizedEvents?.map(event => (
          <div key={event._id} className={wrapperOrgEvents}>
            <h2 className='font-bold'>Название события:</h2>
            <div>{event.title}</div>
            <div className='font-bold mt-[5px]'>Дата события:</div>
            <div>{event.day.toLocaleString().slice(0, 10)}</div>
            <div className='font-bold mt-[5px]'>Время события:</div>
            <div>{event.time}</div>
            <Link to={`/event/${event._id}`} className='font-bold text-white p-[5px]'>Перейти в событие...</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizedEvents;