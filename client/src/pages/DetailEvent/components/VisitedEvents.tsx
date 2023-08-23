import React, { useState, useEffect } from 'react';
import { RootState, AppDispatch } from "../../../redux/store/store";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import { Event } from '../../CreateEvent/interfaces';
import { Link } from "react-router-dom";

const VisitedEvents: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([])
    const user = useSelector((state: RootState) => state.auth.user)

    const getUserEvents = async (userId: string | undefined) => {
        try {

            const response = await axios.post('http://localhost:3002/api/getEventsByUserId', { userId })
            //   dispatch(getAllEvents())

            setEvents(response.data)
            // return response.data;
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
                {events && events.map((event) => <div key={event._id} className='flex flex-col 
                justify-center text-center items-center h-48 w-48 ml-[10px]
                bg-gradient-to-r from-green-400 to-cyan-400 rounded-xl 
                hover:scale-110 transform transition-all duration-200 shadow-xl shadow-white'>
                    <div className='p-[5px]'>Название события:{event.title}</div>
                    <div className='p-[5px]'>Категория события:{event.category}</div>
                    <Link to={`/event/${event._id}`} className='font-bold text-white'>Перейти в событие...</Link>
                </div>)}
            </div>
        </div>
    );
};

export default VisitedEvents;