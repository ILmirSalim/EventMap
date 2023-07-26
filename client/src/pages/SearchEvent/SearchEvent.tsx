import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import Event from './interface/ievent'

export const SearchEvent: React.FC = () => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [events, setEvents] = useState<Event[]>([])
  const [date, setDate] = useState<Date | null>(null);
  const [lastDate, setLastDate] = useState<Date | null>(null);
  const [distance, setDistance] = useState<number>(0)
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0])

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
  };

  const handleSearchDistance = async (
    longitude: number,
    latitude: number,
    distance: number
  ) => {
    try {
      const response = await axios.post<Event[]>(
        'http://localhost:3002/api/filterDistance',
        {
          longitude,
          latitude,
          distance
        }
      );

      setEvents(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearchClick = async (
    title: string,
    category: string,
    startDate: Date | null,
    endDate: Date | null
  ) => {
    try {
      const response = await axios.post<Event[]>(
        'http://localhost:3002/api/search',
        {
          title: title,
          category: category,
          startDate: startDate,
          endDate: endDate
        }
      );

      setEvents(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error(error);
      }
    );
  }, [])
  return (
    <div className='h-[500px] bg-gradient-to-r from-teal-200 to-lime-200 shadow-xl shadow-white w-[1200px] h-full '>
      <div className='p-[10px] flex '>
        <div className='flex flex-col w-[300px]'>
          <label className='font-bold ml-[10px] '>Выберите нужные фильтры: </label>
          <br />
          <label className='ml-[10px]'>Категория:</label>
          <input className='rounded-xl ml-[10px] mt-[10px] p-[5px]'
            placeholder='Категория'
            type="text" value={category}
            onChange={handleCategoryChange} />
          <label className='ml-[10px]'>Заголовок:</label>
          <input className='rounded-xl ml-[10px] p-[5px]'
            type="text" placeholder='Заголовок'
            value={title} onChange={(e) => setTitle(e.target.value)} />
          <label className='ml-[10px]'>С даты:</label>
          <input
            className='rounded-xl ml-[10px] p-[5px]'
            type="date"
            id="date"
            value={date ? date.toISOString().slice(0, 10) : ""}
            onChange={(e) => setDate(new Date(e.target.value))}
          />
          <label className='ml-[10px]'>До даты:</label>
          <input
            className='rounded-xl p-[5px] ml-[10px]'
            type="date"
            id="date"
            value={lastDate ? lastDate.toISOString().slice(0, 10) : ""}
            onChange={(e) => setLastDate(new Date(e.target.value))}
          />
          <br />
          <label className='mr-[10px] ml-[10px]'>Ввести дистанцию:</label>
          <input
            className='rounded-xl p-[5px] mt-[10px]'
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
          />
          <button className=' p-[5px] rounded-lg 
            bg-gradient-to-r from-green-400 
            to-cyan-400 mt-[10px] w-full hover:scale-110 transform transition-all duration-200 '
            onClick={() => handleSearchClick(title, category, date, lastDate)}>
            Искать
          </button>
          <button className='p-[5px] mt-[10px] rounded-lg bg-gradient-to-r 
            from-green-400 to-cyan-400'
            onClick={() => { handleSearchDistance(userLocation[0], userLocation[1], distance) }}>
            Искать по дистанции
          </button>
        </div>
        <div className='flex flex-col ml-[20px]'>
          <h1 className='font-bold  pt-[10px]'>Список событий:</h1>
          <div className='flex  flex-wrap'>
            {events && events.map((event) =>
              <div className='p-[10px] m-[10px] w-48 bg-gradient-to-r from-green-400 to-cyan-400 
              rounded-lg hover:scale-110 transform transition-all duration-200 ' key={event._id}>
                <div className='italic'><p className='font-bold'>Название:</p> {event.title}</div>
                <div className='italic'><p className='font-bold'>Категория:</p>{event.category}</div>
                <div className='italic'><p className='font-bold'>Описание:</p> {event.description}</div>
                {/* <div className='italic'><p className='font-bold'>Дата события:</p> {event.day}</div> */}
                <div className='italic'><p className='font-bold'>Создал событие:</p> {event.userCreatedEvent}</div>
                <Link to={`/event/${event._id}`}>Подробнее о событии...</Link>
              </div>
            )}
            {events.length === 0 && <div className='ml-[370px] pt-[30px]'>Введите критерий поиска....</div>}
          </div>
        </div>
      </div>
    </div>
  );

};
export default SearchEvent;