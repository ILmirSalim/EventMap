import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Link } from "react-router-dom";

export interface Event {
  _id: string;
  title: string,
  description: string,
  locationType: string,
  address: string,
  date: string,
  category: string,
  coordinates: [number, number];
}

interface SearchEventsState {
  searchTerm: string;
  categoryTerm: string;
  startDate: Date | null;
  endDate: Date | null;
  events: Event[];
}

const initialSearchEventsState: SearchEventsState = {
  searchTerm: '',
  categoryTerm: '',
  startDate: null,
  endDate: null,
  events: [],
};
export const SearchEvent: React.FC = () => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [events, setEvents] = useState<Event[]>([])
  const [date, setDate] = useState<Date | null>(null);
  const [lastDate, setLastDate] = useState<Date | null>(null);
  console.log(date);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
  };

  // const handleSearchClick = async (title: string, category: string, date: Date | null) => {

  //   try {

  //     const response = await axios.post<Event[]>(`http://localhost:3002/api/search`, {
  //       title: title,
  //       category: category,
  //       date: date
  //     });
  //     console.log(response.data);
  //     setEvents(response.data)// В response.data будут все записи из базы данных, удовлетворяющие указанной категории
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
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
      console.log(response.data);
      setEvents(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   searchEvents();
  // }, [searchEvents]);

  return (
    <div>
      <div>
        <label className='font-bold'>Выберите нужные фильтры: </label>
        <input className='ml-[10px]' placeholder='Категория' type="text" value={category} onChange={handleCategoryChange} />
        <input className='ml-[10px]' type="text" placeholder='Заголовок' value={title} onChange={(e) => setTitle(e.target.value)} />
        <label className='ml-[10px]'>С даты:</label>
        <input
          className='ml-[10px]'
          type="date"
          id="date"
          value={date ? date.toISOString().slice(0, 10) : ""}
          onChange={(e) => setDate(new Date(e.target.value))}
        />
        <label className='ml-[10px]'>До даты:</label>
        <input
          className='ml-[10px]'
          type="date"
          id="date"
          value={lastDate ? lastDate.toISOString().slice(0, 10) : ""}
          onChange={(e) => setLastDate(new Date(e.target.value))}
        />
        <button className='ml-[10px] bg-sky-500 p-[5px]' onClick={() => handleSearchClick(title, category, date, lastDate)}>Искать</button>
        <h1 className='font-bold ml-[400px] pt-[10px]'>Список событий:</h1>
        <div className='flex'>
          {events && events.map((event) =>
            <div className='p-[10px] bg-sky-500 m-[10px] w-48' key={event._id}>
              <div className='italic'><p className='font-bold'>Название:</p> {event.title}</div>
              <div className='italic'><p className='font-bold'>Категория:</p>{event.category}</div>
              <div className='italic'><p className='font-bold'>Описание:</p> {event.description}</div>
              <div className='italic'><p className='font-bold'>Дата события:</p> {event.date.toString()}</div>
              
              <Link to={`/event/${event._id}`}>Подробнее о событии...</Link>
            </div>
          )}
          {events.length===0 && <div className='ml-[370px] pt-[30px]'>Введите критерий поиска....</div>}
        </div>
      </div>
    </div>
  );

};
export default SearchEvent;