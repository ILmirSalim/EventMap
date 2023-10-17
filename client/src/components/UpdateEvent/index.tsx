import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { YMaps, Map, Placemark, GeolocationControl } from "@pbe/react-yandex-maps";
import { useDispatch, useSelector } from 'react-redux';
import { updateEvent } from '../../redux/slices/eventSlice';
import { AppDispatch, RootState } from '../../redux/store/store'
import { useNavigate, useParams } from 'react-router-dom';
import { Event } from './interfaces';
import IEventState from './interfaces';
import socketIOClient from 'socket.io-client';
import { apiServer } from '../../constants';
import { updateEventButton } from './style';

const socket = socketIOClient(apiServer);

export const UpdateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationType, setLocationType] = useState('');
  const [coordinates, setCoordinates] = useState<any>([]);
  const [address, setAddress] = useState('');
  const [day, setDay] = useState<Date>(new Date());
  const [time, setTime] = useState<string>('');
  const [category, setCategory] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
  const [placemarkCoordinates, setPlacemarkCoordinates] = useState<number[]>([])
  const [userCreatedEvent, setUserCreatedEvent] = useState<string | undefined>('')
  
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const { id } = useParams<{ id: string }>();
  const { events } = useSelector((state: { event: IEventState }) => state.event);

  const setPlacemarkInMap = (event: any) => {
    const clickedCoordinates = [event.get('coords')[0], event.get('coords')[1]];
    setCoordinates(clickedCoordinates);
    setPlacemarkCoordinates([event.get('coords')[0], event.get('coords')[1]]);
  };
  const navigate = useNavigate()
  const event = events?.find((event: Event) => event._id === id);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const point = "Point"
    
    const modifiedEvent = {
      id: id,
      title: title,
      description: description,
      locationType: locationType,
      location: {
        type: point,
        coordinates: coordinates,
      },
      address: address,
      day: day,
      time: time,
      category: category,
      userCreatedEvent: userCreatedEvent || '' 
    };

    try {
      dispatch(updateEvent(modifiedEvent));
      socket.emit('update event', modifiedEvent)
      navigate('/search-event')
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
      setTitle(event!.title)
      setDescription(event!.description)
      setLocationType(event!.locationType)

    setUserCreatedEvent(user?.email)

  }, [user?.email, event]);

  return (
    <div className='flex justify-center items-center  shadow-xl shadow-white w-[1200px]'>
      <div>
        <h1 className='font-bold pl-[-10px] mb-[10px]'>Отредактируйте данные о событии:</h1>
        <form onSubmit={handleSubmit} className='flex flex-col items-center w-[200px]'>
          <label className=''>
            Название события:
          </label>
          <input className=' mb-[10px] rounded-xl outline-none p-[5px]'
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)} />

          <label>
            Описание:
          </label>
          <input className='rounded-xl outline-none p-[5px]'
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)} />

          <label className='mt-[10px]  '>
            Тип местоположения:

          </label>
          <input className=' mb-[5px]  rounded-xl outline-none p-[5px]'
            type="text"
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)} />

          <label>
            Адрес:
          </label>
          <input className=' mb-[5px]  rounded-xl outline-none p-[5px]'
            type="text" value={address}
            onChange={(e) => setAddress(e.target.value)} />

          <label>
            Дата:
          </label>
          <input className='mb-[5px] rounded-xl outline-none p-[5px] w-full text-center'
            type="date"
            value={day.toISOString().slice(0, 10)}
            onChange={(e) => setDay(new Date(e.target.value))} />

          <label >
            Время события:
          </label>
          <input className='w-full mb-[5px] text-center rounded-xl outline-none p-[5px]'
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)} />

          <label>
            Категория:
          </label>
          <input className='w-full  mb-[5px]  rounded-xl outline-none p-[5px]'
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)} />

          <button
            className={updateEventButton}
            type="submit">Отредактировать событие</button>
        </form>
      </div>

      <div className='ml-[80px] mb-[50px]'>
        <div className='block mb-[10px]'>
          <p className='font-bold pl-[10px]'>Выберите новое место события:</p>
          <p className='font-bold pl-[10px]'>*кликните по карте</p>
        </div>
        <div className=''>
          <YMaps>
            <Map className=''
              defaultState={{ center: userLocation, zoom: 10 }}
              onClick={setPlacemarkInMap}
              style={{ width: "500px", height: "500px" }}
            >
              {placemarkCoordinates && (
                <Placemark geometry={placemarkCoordinates} />
              )}
              {userLocation && <Placemark
                geometry={userLocation}
                options={{
                  preset: 'islands#blueCircleDotIcon',
                  hideIconOnBalloonOpen: false,
                  balloonOffset: [-1, -11],
                }}
                modules={['geoObject.addon.balloon']}
                onClick={(e: any) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.get('target').balloon.open();
                }}
                properties={{
                  balloonContent: `<h2>Мое местоположение</h2>`,
                }} />}
              <GeolocationControl options={{ float: "left" }} />
            </Map>
          </YMaps>
        </div>
      </div>
    </div>
  );
};

export default UpdateEvent;