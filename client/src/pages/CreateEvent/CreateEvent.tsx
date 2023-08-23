import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { YMaps, Map, Placemark, GeolocationControl } from "@pbe/react-yandex-maps";
import { useDispatch, useSelector } from 'react-redux';
import { addEvent, getAllEvents } from '../../redux/slices/eventSlice';
import { AppDispatch, RootState } from '../../redux/store/store'
import { Event, EventState } from './interfaces';
import socketIOClient from 'socket.io-client';

export const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationType, setLocationType] = useState('');
  const [coordinates, setCoordinates] = useState<any>([]);
  const [address, setAddress] = useState('');
  const [day, setDay] = useState<any>();
  const [time, setTime] = useState<any>();
  const [category, setCategory] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
  const [placemarkCoordinates, setPlacemarkCoordinates] = useState<number[]>([])
  const [userCreatedEvent, setUserCreatedEvent] = useState<string | undefined>('')
  const [showNotification, setShowNotification] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  
  const setPlacemarkInMap = (event: any) => {
    const clickedCoordinates = [event.get('coords')[0], event.get('coords')[1]];
    setCoordinates(clickedCoordinates);
    setPlacemarkCoordinates([event.get('coords')[0], event.get('coords')[1]]);
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const point = "Point"
    
    const newEvent = {
      
      title: title,
      description: description,
      locationType: locationType,
      location: {
        type: {
          type: point,
        },
        coordinates: coordinates,
      },
      address: address,
      day: day,
      time: time,
      category: category,
      userCreatedEvent: userCreatedEvent || '' 
    };

    try {
      dispatch(addEvent(newEvent));
      // socket.emit('create event', newEvent)
      setShowNotification(true)

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

    setUserCreatedEvent(user?.email)

  }, [user?.email]);

  return (
    <div className='flex justify-center items-center  shadow-xl shadow-white w-[1200px]'>
      <div>
        <h1 className='font-bold pl-[-10px] mb-[10px]'>Введите данные о событии:</h1>
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
            value={day}
            onChange={(e) => setDay(e.target.value)} />

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
            className='mt-4 mb-4 w-full bg-gradient-to-r from-green-400 to-cyan-400
            hover:scale-110 transform transition-all duration-200   
            hover:text-white active:bg-violet-700 focus:outline-none 
            focus:ring focus:ring-violet-300 rounded-xl outline-none p-[5px]'
            type="submit">Создать событие</button>
        </form>
      </div>

      <div className='ml-[80px] mb-[50px]'>
        <div className='block mb-[10px]'>
          <p className='font-bold pl-[10px]'>Выберите место события:</p>
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
      {showNotification && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, padding: 10, background: 'gray', color: 'white' }}>
          Событие успешно добавлено!
        </div>
      )}
    </div>
  );
};

export default CreateEvent;