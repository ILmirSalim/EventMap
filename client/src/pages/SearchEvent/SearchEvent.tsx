import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

export interface Event {
  userCreatedEvent: string
  _id: string;
  title: string,
  description: string,
  locationType: string,
  address: string,
  day: Date,
  time: string,
  category: string,
  coordinates: [number, number];
}

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
    <div className='h-[500px] bg-cyan-400 w-[1200px]'>
      <div className='p-[10px]'>
        <label className='font-bold'>Выберите нужные фильтры: </label>
        <input className='rounded-xl ml-[10px] p-[5px]' placeholder='Категория' type="text" value={category} onChange={handleCategoryChange} />
        <label className='ml-[10px]'>Заголовок:</label>
        <input className='rounded-xl ml-[10px] p-[5px]' type="text" placeholder='Заголовок' value={title} onChange={(e) => setTitle(e.target.value)} />
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
        <label className='mr-[10px]'>Ввести дистанцию:</label>
        <input
          className='rounded-xl p-[5px]'
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
        />

        <button className='ml-[10px] bg-sky-500 p-[5px] rounded-lg hover:' onClick={() => handleSearchClick(title, category, date, lastDate)}>Искать</button>
        <button onClick={() => {
          handleSearchDistance(userLocation[0], userLocation[1], distance)
        }}>Искать по дистанции</button>
        <h1 className='font-bold ml-[400px] pt-[10px]'>Список событий:</h1>
        <div className='flex w-7/12'>
          {events && events.map((event) =>
            <div className='p-[10px] bg-sky-500 m-[10px] w-48' key={event._id}>
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
  );

};
export default SearchEvent;