import React from 'react';
import { useSelector } from 'react-redux';
import { EventState } from '../../../CreateEvent/interfaces';
import { RootState } from '../../../../redux/store/store'
import { Link } from "react-router-dom";
const OrganizedEvents: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const email = user!.email

  const { events } = useSelector((state: { event: EventState }) => state.event);
  const organizedEvents = events?.filter(event =>
    event.userCreatedEvent.includes(email)
  )

  return (
    <div className='flex flex-wrap justify-center items-center'>
      {organizedEvents?.length === 0 && <div>Нет организуемых событий...</div>}
      <div className='flex flex-wrap w-full '>
        {organizedEvents?.map(event => (
          <div key={event._id} className='flex flex-col justify-center text-center items-center 
            m-[10px] h-52 w-48 p-[5px] bg-gradient-to-r from-green-400 to-cyan-400 rounded-xl 
            hover:scale-110 transform transition-all duration-400 shadow-xl shadow-white'>
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