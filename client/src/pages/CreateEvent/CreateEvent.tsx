import React, { useEffect, useState } from 'react';
import { YMaps, Map, Placemark, GeolocationControl } from "@pbe/react-yandex-maps";
import axios from 'axios';
import { FilterEvents } from '../../components/Filter/FilterEvents';

interface Event {
  _id: string;
  title: string,
  description: string,
  locationType: string,
  address: string,
  date: Date,
  category: string,
  coordinates: [number, number];
}

export const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationType, setLocationType] = useState('');
  const [coordinates, setCoordinates] = useState<number[]>([]);
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
  const [placemarkCoordinates, setPlacemarkCoordinates] = useState<number[]>([])

  const [events, setEvents] = useState<Event[]>([])
  const [distanceFilter, setDistanceFilter] = useState<number>();
  const [typeFilter, setTypesFilter] = useState<string[]>();
  const [dateFilter, setDateFilter] = useState<Date>();
  const [timeFilter, setTimeFilter] = useState<number>();

  const handleMapClick = (event: any) => {
    const clickedCoordinates = [event.get('coords')[0], event.get('coords')[1]];
    setCoordinates(clickedCoordinates);
    setPlacemarkCoordinates(clickedCoordinates);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newEvent = {
      title: title,
      description: description,
      locationType: locationType,
      coordinates: coordinates,
      address: address,
      date: date,
      category: category,
    };
    try {
      const response = await axios.post('http://localhost:3002/api/newevent', newEvent);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

  };

  const getAllevents = async () => {
    try {
      const response = await axios.get("http://localhost:3002/api/events");
      setEvents(response.data);
    } catch (error) {
      console.error(error);
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
    getAllevents()
  }, []);

  return (
    <div className='justify-center items-center'>
      <h1>Создать событие</h1>
      <form onSubmit={handleSubmit}>
        <label >
          Заголовок
          <input className='mt-4' type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <br />
        <label>
          Описание:
          <input className='mt-4' type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <br />
        <label>
          Тип местоположения:
          <input className='mt-4' type="text" value={locationType} onChange={(e) => setLocationType(e.target.value)} />
        </label>
        <br />
        <label>
          Адрес:
          <input className='mt-4' type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>
        <br />
        <label>
          Дата:
          <input className='mt-4' type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <br />
        <label>
          Категория:
          <input className='mt-4' type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        </label>
        <br />
        <button className='mt-4 mb-4 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300' type="submit">Создать событие</button>
      </form>
      <h3>Выберите место события:</h3>
      <div className='flex'>
      <YMaps>
        <Map
          defaultState={{ center: userLocation, zoom: 10 }}
          onClick={handleMapClick}
          style={{ width: "40%", height: "500px" }}
        >
          {events && events.map((event) => (
            <Placemark
              key={event._id}
              geometry={event.coordinates}
              properties={{
                balloonContent: `
                  <h2>${event.title}</h2>
                  <p>${event.description}</p>
                  <p>${event.address}</p>
                  <p>${event.date}</p>
                `,
              }}
              options={{
                iconColor: "#ff0000",
                hideIconOnBalloonOpen: false,
                balloonOffset: [3, -40],
              }}
              modules={['geoObject.addon.balloon']}
              onClick={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                e.get('target').balloon.open();
              }}
            />
          ))}
          {placemarkCoordinates && (
            <Placemark geometry={placemarkCoordinates} />
          )}
          {userLocation && <Placemark geometry={userLocation} options={{ preset: 'islands#blueCircleDotIcon' }} />}
          <GeolocationControl options={{ float: "left" }} />
        </Map>
      </YMaps>
      <FilterEvents 
      setDistanceFilter={setDistanceFilter}
      setTypesFilter={setTypesFilter}
      setDateFilter={setDateFilter}
      setTimeFilter={setTimeFilter}/>
      </div>
      
    </div>
  );
};

export default CreateEvent;