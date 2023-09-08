import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { YMaps, Map, Placemark, GeolocationControl } from "@pbe/react-yandex-maps";
import { useDispatch, useSelector } from 'react-redux';
import { addEvent } from '../../redux/slices/eventSlice';
import { AppDispatch, RootState } from '../../redux/store/store'
import socketIOClient from 'socket.io-client';
import { Event, EventState } from './interfaces';

const ENDPOINT = 'http://localhost:3002';
const socket = socketIOClient(ENDPOINT);

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
  const [disabled, setDisabled] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File>();

  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch: AppDispatch = useDispatch<AppDispatch>()

  const setPlacemarkInMap = (event: any) => {
    const clickedCoordinates = [event.get('coords')[0], event.get('coords')[1]];
    setCoordinates(clickedCoordinates);
    setPlacemarkCoordinates([event.get('coords')[0], event.get('coords')[1]]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
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
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('locationType', locationType);
    formData.append('location[type][type]', point);
    formData.append('location[coordinates]', JSON.stringify(coordinates));
    formData.append('address', address);
    formData.append('day', JSON.stringify(day));
    formData.append('time', JSON.stringify(time));
    formData.append('category', category);
    formData.append('userCreatedEvent', userCreatedEvent || '');

    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      dispatch(addEvent(formData))
      socket.emit('create event', newEvent);
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
    setDisabled(!(description && locationType && coordinates && address && day && time && category))
    setUserCreatedEvent(user?.email)

  }, [user?.email, title, description, locationType, coordinates, address, day, time, category]);


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

          <input className='mt-[10px]' type="file" onChange={handleFileChange} />

          <button disabled={disabled}
            className='mt-4 mb-4 w-full bg-gradient-to-r from-green-400 to-cyan-400
            hover:scale-110 transform transition-all duration-200   
            hover:text-white active:bg-violet-700 focus:outline-none 
            focus:ring focus:ring-violet-300 rounded-xl outline-none p-[5px]
            disabled:opacity-50 disabled:hover:scale-100 disabled:text-black'
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
    </div>
  );
};

export default CreateEvent;