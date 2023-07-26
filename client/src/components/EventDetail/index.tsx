import React, { useState, useEffect } from "react";
import { useNavigate, useParams, } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store/store";
import { Event } from "../../pages/CreateEvent/interfaces";
import { getAllEvents } from '../../redux/slices/eventSlice';
import axios from 'axios';
interface EventState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  event: Event | null;
  events: Event[] | null;
}
export const EventDetail = () => {
  const [inEvent, setInEvent] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [textFeedback, setTextFeedback] = useState<string>('')
  const [rating, setRating] = useState<number>(0)
  const [resultRate, setResultRate] = useState<any>(0)
  const { id } = useParams<{ id: string }>();
  const { events } = useSelector((state: { event: EventState }) => state.event);
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  console.log(rating);

  const event = events?.find((event: Event) => event._id === id);

  const handleChange = (event: any) => {
    setRating(event.target.value);
  };
  const handleNavigate = () => {
    navigate('/search-event');
  };

  function average(array: number[]) {
    let sum = 0;
    if (array.length > 0) {
      for (let i = 0; i < array!.length; i++) {
        sum += array![i];
      }
      let avg = sum / array?.length;
      return avg.toFixed(1);
    }
  }

  const addUserToEvent = async (eventId: string, userId: string | undefined) => {
    try {
      setIsLoading(true);
      if (event?.users.includes(userId as never)) {
        alert('Вы уже подтвердили участие!')
      }
      await axios.post('http://localhost:3002/api/addUserToEvent', { eventId, userId })
      dispatch(getAllEvents())
      alert('Вы успешно подтвердили участие!')

      // return response.data;
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

      // return response.data;
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
      setResultRate(average(event!.rating))
    }

  }, [event?.users, user?._id, event])
  console.log(resultRate);
  if (!event) {
    return <div>Сообщение не найдено</div>;
  }

  return (
    <div className="p-[10px] shadow-lg shadow-white w-2/3 h-[500px] bg-gradient-to-r from-green-400 to-cyan-400 ">
      <div className="text-white">
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
          className="p-[5px] text-xs bg-lime-600"
          onClick={() => addUserToEvent(id!, user?._id)}
        >
          Подтвердить участие в мероприятии
        </button>
      )}

      {isLoading && inEvent && <p>Подтверждение участия...</p>}
      {!isLoading && inEvent && <div>
        <div className="flex">
          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12ZM15.7127 10.7197C16.0055 10.4268 16.0055 9.95192 15.7127 9.65903C15.4198 9.36614 14.9449 9.36614 14.652 9.65903L10.9397 13.3713L9.34869 11.7804C9.0558 11.4875 8.58092 11.4875 8.28803 11.7804C7.99514 12.0732 7.99514 12.5481 8.28803 12.841L10.4093 14.9623C10.7022 15.2552 11.1771 15.2552 11.47 14.9623L15.7127 10.7197Z" fill="green" />
          </svg>
          <p className="font-bold color-white">Я участвую!</p>
        </div>

        <button
          className="p-[5px] text-xs bg-red-600 hover:bg-red-300 hover:font-bold"
          onClick={() => removeUserFromEvent(id!, user?._id)}>
          Отменить участие в мероприятии
        </button>
        
      </div>}
      <div className="py-[13px]">
        <div>Введите текст комментария:</div>
        <input className="border pl-[2px] w-44 outline-none rounded-lg"
          placeholder="Текст комментария..."
          type="text"
          onChange={(event) => setTextFeedback(event.target.value)} />
      </div>

      <div className="p-[5px]">Оцени мероприятие:</div>
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
        className="mt-[10px] cursor-pointer font-bold hover:bg-green-500 hover:text-white">
        Добавить отзыв о событии...</button>

      {event?.feedbackUser && event?.feedbackUser.map((feedback) => <div>
        <div className="">Пользователь:{feedback.user}</div>
        <div className="m-[10px] bg-sky-300 shadow-xl shadow-white">{feedback.feedback}</div>
      </div>)}
      <button className="mt-[10px] cursor-pointer font-bold hover:text-white" onClick={handleNavigate}>Назад</button>
    </div>
  );
};

export default EventDetail