import React, { useState, useEffect } from 'react';
import { RootState } from "../../../redux/store/store";
import { Event } from '../../CreateEvent/interfaces';
import { apiServer } from '../../../constants';
import { wrapperVisEvents } from './style';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from 'axios';

const VisitedEvents: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([])
    const user = useSelector((state: RootState) => state.auth.user)

    const getUserEvents = async (userId: string | undefined) => {
        try {
            const response = await axios.post(`${apiServer}/getEventsByUserId`, { userId })
            setEvents(response.data)
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getUserEvents(user?._id)
    }, [user?._id])

    return (
        <div className='shadow-xl shadow-white w-[1200px] h-full flex justify-center '>
            {events.length === 0 && <div>Нет событий в которых участвует пользователь</div>}
            <div className='flex flex-wrap'>
                {events && events.map((event) => <div key={event._id} className={wrapperVisEvents}>
                    <div className='p-[5px]'>Название события:{event.title}</div>
                    <div className='p-[5px]'>Категория события:{event.category}</div>
                    <Link to={`/event/${event._id}`} className='font-bold text-white'>Перейти в событие...</Link>
                </div>)}
            </div>
        </div>
    );
};

export default VisitedEvents;