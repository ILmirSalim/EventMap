import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store/store";
import { Event } from "../../pages/CreateEvent/interfaces";
import { getAllEvents, deleteEvent } from "../../redux/slices/eventSlice";
import { addUserInEvent } from "../../redux/slices/userSlice";
import averageValueRating from "../../helpers/index";
import IEventState from "./interface/IEventState";
import InEvent from "../../assets/inEvent.svg";
import { apiServer } from "../../constants";
import axios from "axios";
import PointsComponent from "./PointsComponent";

export const EventCard = () => {
  const [inEvent, setInEvent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [textFeedback, setTextFeedback] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [resultRate, setResultRate] = useState<any>(0);

  const { id } = useParams<{ id: string }>();
  const { events } = useSelector(
    (state: { event: IEventState }) => state.event
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const event = events?.find((event: any) => event._id === id);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRating(+event.target.value);
  };

  const handleNavigate = () => {
    navigate("/search-event");
  };
  const removeEvent = () => {
    dispatch(deleteEvent(id!));
    navigate("/search-event");
  };

  const addUserToEvent = async (
    eventId: string,
    userId: string | undefined,
    userName: string
  ) => {
    try {
      setIsLoading(true);
      if (event?.users.includes(userId as never)) {
        alert("Вы уже подтвердили участие!");
      }
      await dispatch(addUserInEvent({ eventId, userId, userName }));
      dispatch(getAllEvents());
      alert("Вы успешно подтвердили участие!");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFeedback = async (
    user: string | undefined,
    eventId: string,
    feedback: string | undefined,
    rating: number
  ) => {
    try {
      await axios.post(`${apiServer}/addFeedbackToEvent`, {
        user,
        eventId,
        feedback,
        rating,
      });
      dispatch(getAllEvents());
      alert("Отзыв добавлен!");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeUserFromEvent = async (
    eventId: string,
    userId: string | undefined
  ) => {
    try {
      setIsLoading(true);
      await axios.post(`${apiServer}/removeUserFromEvent`, { eventId, userId });
      dispatch(getAllEvents());
      alert("Вы успешно отменили участие!");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (event?.users.find((u) => u.userId === user?._id)) {
      setInEvent(true);
    } else {
      setInEvent(false);
    }
    if (event?.rating) {
      setResultRate(averageValueRating(event!.rating));
    }
  }, [event?.users, user?._id, event]);
  console.log(resultRate);
  if (!event) {
    return <div>Страница не найдена...</div>;
  }

  return (
    <div
      className="p-[10px] shadow-lg shadow-white w-[600px] h-[1300px] 
    bg-gradient-to-r from-green-400 to-cyan-400 
    flex flex-col justify-center items-center rounded-xl box-border"
    >
      <div
        className="flex flex-col items-center text-center mt-[-50px] 
      border-white border p-[10px] w-full rounded-xl"
      >
        {!event.image && <>Нет изображения события</>}
        {event.image && (
          <img
            className="h-[100px] w-[100px] rounded-lg"
            src={`http://localhost:3002/${event.image.split("\\").pop()}`}
            alt="paintEvent"
          />
        )}
        <h2 className="font-bold"> Название мероприятия: {event.title}</h2>
        <div className="">
          <p>
            <span className="font-bold">Организатор мероприятия:</span>{" "}
            {event.userCreatedEvent}{" "}
          </p>
          <Link
            to={`/private-chat/`}
            className="hover:text-white cursor-pointer"
          >
            Написать организатору...
          </Link>
        </div>
        <div className="">
          <p className="font-bold">Участники события:</p>
          <div className="flex justify-center items-center">
            {event.users.map((user) => (
              <div className="p-[3px]" key={user.userId}>
                {user.userName}
              </div>
            ))}
          </div>
        </div>
        <p>
          <span className="font-bold">Описание события:</span>{" "}
          {event.description}
        </p>
        <p>
          <span className="font-bold">Местоположение:</span>{" "}
          {event.locationType}
        </p>
        <p>
          <span className="font-bold">Адрес:</span> {event.address}
        </p>
        <p>
          <span className="font-bold">Рейтинг мероприятия:</span>
        </p>
        <p>{!resultRate && <>Еще нет рейтинга у события...</>}</p>
        <p>{resultRate && resultRate}</p>
        <Link
          to={`/updateEvent/${event._id}`}
          className="p-[10px] rounded-xl 
          mt-[10px] cursor-pointer hover:text-white border-white border"
        >
          Редактировать событие...
        </Link>
      </div>
      {isLoading && <p>Загрузка...</p>}
      {!isLoading && !inEvent && (
        <button
          className="p-[10px] text-xs bg-gradient-to-r from-green-400 to-cyan-400 
          hover:scale-110 transform transition-all duration-200   
          hover:text-white rounded-xl mt-[10px] border-white border"
          onClick={() => addUserToEvent(id!, user?._id, user!.userName)}
        >
          Подтвердить участие в мероприятии
        </button>
      )}

      {isLoading && inEvent && <p>Подтверждение участия...</p>}
      {!isLoading && inEvent && (
        <div>
          <div className="flex mt-[20px] justify-center">
            <img src={InEvent} alt="inEvent" />
            <p className="font-bold color-white ml-[5px]">Я участвую!</p>
          </div>
          <button
            className="mt-[10px] p-[10px] bg-gradient-to-r from-green-400 to-cyan-400 
           hover:bg-red-300 border-white border rounded-xl
           hover:scale-110 transform transition-all duration-200"
            onClick={() => removeUserFromEvent(id!, user?._id)}
          >
            Отменить участие в мероприятии
          </button>
        </div>
      )}

      <div
        className="flex flex-col items-center text-center border-white mt-[50px] 
        border p-[10px] w-full mt-[10px] rounded-xl"
      >
        <div className=" flex flex-col items-center text-center ">
          <div className="font-bold">Введите текст комментария:</div>
          <input
            className="border pl-[2px] w-44 outline-none rounded-lg w-full text-center"
            placeholder="Текст комментария..."
            type="text"
            onChange={(event) => setTextFeedback(event.target.value)}
          />
        </div>
        <div className="mt-[10px] font-bold">Поставьте оценку мероприятию:</div>
        <PointsComponent handleChange={handleChange}/>
        {/* <div className="flex">
          <div>
            <input
              type="radio"
              id="rating1"
              name="rating"
              value="1"
              onChange={handleChange}
            />
            <label className="pl-[5px] pr-[5px]" htmlFor="rating1">
              1
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="rating2"
              name="rating"
              value="2"
              onChange={handleChange}
            />
            <label className="pl-[5px] pr-[5px]" htmlFor="rating2">
              2
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="rating3"
              name="rating"
              value="3"
              onChange={handleChange}
            />
            <label className="pl-[5px] pr-[5px]" htmlFor="rating3">
              3
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="rating4"
              name="rating"
              value="4"
              onChange={handleChange}
            />
            <label className="pl-[5px] pr-[5px]" htmlFor="rating4">
              4
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="rating5"
              name="rating"
              value="5"
              onChange={handleChange}
            />
            <label className="pl-[5px] pr-[5px]" htmlFor="rating5">
              5
            </label>
          </div>
        </div> */}
        <button
          onClick={() => addFeedback(user?.email, id!, textFeedback, rating)}
          className="p-[10px] text-xs bg-gradient-to-r from-green-400 to-cyan-400 
        hover:scale-110 transform transition-all duration-200   
        hover:text-white rounded-xl mt-[5px] border-white border"
        >
          Добавить отзыв и оценку о событии...
        </button>
      </div>
      <div className="font-bold mt-[20px]">Отзывы о событии:</div>
      <div className="flex flex-col items-center overflow-y-auto max-h-[150px]">
        {event?.feedbackUser &&
          event?.feedbackUser.map((feedback) => (
            <div
              key={feedback.feedback}
              className="rounded-xl p-[10px] text-center border-white border m-[10px]"
            >
              <div className="">Пользователь:{feedback.user}</div>
              <div className="mt-[5px]">{feedback.feedback}</div>
            </div>
          ))}
        {event?.feedbackUser?.length === 0 && <>Еще нет комментариев...</>}
      </div>
      <button
        className="border-white border p-[10px] 
        rounded-xl mt-[20px] cursor-pointer font-bold 
        hover:text-white"
        onClick={handleNavigate}
      >
        Назад
      </button>
      {event.userCreatedEvent === user?.email && (
        <button
          className="border-white border p-[10px] 
        rounded-xl mt-[10px] cursor-pointer 
        font-bold hover:text-white hover:bg-red-600"
          onClick={removeEvent}
        >
          Удалить событие
        </button>
      )}
    </div>
  );
};

export default EventCard;
