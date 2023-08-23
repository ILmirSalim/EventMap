import React, { useState, useEffect } from "react";
import { useNavigate, useParams, } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store/store";
import { Event } from "../../pages/CreateEvent/interfaces";
import { getAllEvents, deleteEvent } from '../../redux/slices/eventSlice';
import { addUserInEvent } from '../../redux/slices/userSlice'
import averageValueRating from '../../helpers/index'
import IEventState from "./interface/IEventState";
import InEvent from '../../assets/inEvent.svg'
import axios from 'axios';

export const EventCard = () => {
  const [inEvent, setInEvent] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [textFeedback, setTextFeedback] = useState<string>('')
  const [rating, setRating] = useState<number>(0)
  const [resultRate, setResultRate] = useState<any>(0)

  const { id } = useParams<{ id: string }>();
  const { events } = useSelector((state: { event: IEventState }) => state.event);
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const event = events?.find((event: Event) => event._id === id);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRating(+event.target.value);
  };

  const handleNavigate = () => {
    navigate('/search-event');
  };
  const removeEvent = () => {
    dispatch(deleteEvent(id!))
    navigate('/')
  }

  
  const addUserToEvent = async (eventId: string, userId: string | undefined) => {
    try {
      setIsLoading(true);
      if (event?.users.includes(userId as never)) {
        alert('Вы уже подтвердили участие!')
      }
      await dispatch(addUserInEvent({eventId, userId}))
      dispatch(getAllEvents())
      alert('Вы успешно подтвердили участие!')
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFeedback = async (user: string | undefined, eventId: string, feedback: string | undefined, rating: number) => {
    try {

      await axios.post('http://localhost:3002/api/addFeedbackToEvent', { user, eventId, feedback, rating })
      dispatch(getAllEvents())
      alert('Отзыв добавлен!')

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeUserFromEvent = async (eventId: string, userId: string | undefined) => {
    try {
      setIsLoading(true);
      await axios.post('http://localhost:3002/api/removeUserFromEvent', { eventId, userId })
      dispatch(getAllEvents())
      alert('Вы успешно отменили участие!')

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {

    if (event?.users.includes(user?._id as never)) {
      setInEvent(true)
    } else {
      setInEvent(false)
    }
    if (event?.rating) {
      setResultRate(averageValueRating(event!.rating))
    }

  }, [event?.users, user?._id, event])
  console.log(resultRate);
  if (!event) {
    return <div>Сообщение не найдено</div>;
  }

  return (
    <div className="p-[10px] shadow-lg shadow-white w-2/3 h-[600px] 
    bg-gradient-to-r from-green-400 to-cyan-400 
    flex flex-col justify-center items-center">
      <div className="text-white text-center mt-[-50px]">
        <h2 className="font-bold"> Название мероприятия: {event.title}</h2>
        <p>Описание события: {event.description}</p>
        <p>Местоположение: {event.locationType}</p>
        <p>Адрес: {event.address}</p>
        <p>Рейтинг мероприятия:</p>
        <p>{resultRate && resultRate}</p>
      </div>
      {isLoading && <p>Загрузка...</p>}
      {!isLoading && !inEvent && (
        <button
          className="p-[10px] text-xs bg-gradient-to-r from-green-400 to-cyan-400 
          hover:scale-110 transform transition-all duration-200   
          hover:text-white rounded-xl mt-[5px] border-white border"
          onClick={() => addUserToEvent(id!, user?._id)}
        >
          Подтвердить участие в мероприятии
        </button>
      )}

      {isLoading && inEvent && <p>Подтверждение участия...</p>}
      {!isLoading && inEvent && <div>
        <div className="flex">
          <img src={InEvent} alt="" />
          <p className="font-bold color-white ml-[5px]">Я участвую!</p>
        </div>

        <button
          className="p-[5px] text-xs bg-red-600 hover:bg-red-300 hover:font-bold border-white border"
          onClick={() => removeUserFromEvent(id!, user?._id)}>
          Отменить участие в мероприятии
        </button>

      </div>}
      <div className="mt-[10px] flex flex-col items-center text-center">
        <div className="font-bold">Введите текст комментария:</div>
        <input className="border pl-[2px] w-44 outline-none rounded-lg w-full text-center"
          placeholder="Текст комментария..."
          type="text"
          onChange={(event) => setTextFeedback(event.target.value)} />
      </div>

      <div className="mt-[10px] font-bold">Поставьте оценку мероприятию:</div>
      <div className="flex">
        <div>
          <input type="radio" id="rating1" name="rating" value="1" onChange={handleChange} />
          <label className="pl-[5px] pr-[5px]" htmlFor="rating1">1</label>
        </div>
        <div>
          <input type="radio" id="rating2" name="rating" value="2" onChange={handleChange} />
          <label className="pl-[5px] pr-[5px]" htmlFor="rating2">2</label>
        </div>
        <div>
          <input type="radio" id="rating3" name="rating" value="3" onChange={handleChange} />
          <label className="pl-[5px] pr-[5px]" htmlFor="rating3">3</label>
        </div>
        <div>
          <input type="radio" id="rating4" name="rating" value="4" onChange={handleChange} />
          <label className="pl-[5px] pr-[5px]" htmlFor="rating4">4</label>
        </div>
        <div>
          <input type="radio" id="rating5" name="rating" value="5" onChange={handleChange} />
          <label className="pl-[5px] pr-[5px]" htmlFor="rating5">5</label>
        </div>
      </div>

      <button onClick={() => addFeedback(user?.email, id!, textFeedback, rating)}
        className="p-[10px] text-xs bg-gradient-to-r from-green-400 to-cyan-400 
        hover:scale-110 transform transition-all duration-200   
        hover:text-white rounded-xl mt-[5px] border-white border">
        Добавить отзыв и оценку о событии...</button>
      <div className="font-bold mt-[20px]">Отзывы о событии:</div>
      <div className="flex flex-wrap">
        {event?.feedbackUser && event?.feedbackUser.map((feedback) => <div key={feedback.feedback} className="rounded-xl p-[10px] text-center" >
          <div className="">Пользователь:{feedback.user}</div>
          <div className="mt-[5px]">{feedback.feedback}</div>
        </div>)}
        {event?.feedbackUser?.length===0 && <>Еще нет комментариев...</>}
      </div>
      <button className="border-white border p-[10px] rounded-xl mt-[50px] cursor-pointer font-bold hover:text-white" onClick={handleNavigate}>Назад</button>
      <button className="border-white border p-[10px] rounded-xl mt-[10px] cursor-pointer font-bold hover:text-white hover:bg-red-600" onClick={removeEvent}>Удалить событие</button>
    </div>
  );
};

export default EventCard