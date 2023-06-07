import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { Event } from "../../pages/CreateEvent/CreateEvent";
interface EventState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  event: Event | null;
  events: Event[] | null;
}
export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {events}  = useSelector((state: { event: EventState }) => state.event);
  const user = useSelector((state: RootState) => state.auth.user)
  console.log(user);
  
  const navigate = useNavigate()
  console.log('events', events);
  
  const event = events?.find((event: Event) => event._id===id);
   
  const handleNavigate = () => {
    navigate('/search-event');
  };
  console.log(event);
  
  if (!event) {
    return <div>Сообщение не найдено</div>;
  }

  return (
    <div className="p-[10px] shadow-sm shadow-white w-36">
      <h2 className="font-bold">{event.title}</h2>
      <p>{event.description}</p>
      <p>{event.locationType}</p>
      <p>{event.address}</p>
      <button className="p-[5px] text-xs bg-lime-600">Подтвердить участие в мероприятии</button>

      <button className="mt-[10px] cursor-pointer font-bold" onClick={handleNavigate}>Назад</button>
    </div>
  );
};