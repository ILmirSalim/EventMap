import React, { useEffect, useState } from 'react';
import { YMaps, Map, Placemark, GeolocationControl } from "@pbe/react-yandex-maps";
import { useDispatch, useSelector } from 'react-redux';
import { addEvent, getAllEvents } from '../../redux/slices/eventSlice';
import { AppDispatch, RootState  } from '../../redux/store/store'
import { Event, EventState } from './interfaces';


export const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationType, setLocationType] = useState('');
  const [coordinates, setCoordinates] = useState<any>([]);
  const [address, setAddress] = useState('');
  const [date, setDate] = useState<any>();
  const [category, setCategory] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
  const [placemarkCoordinates, setPlacemarkCoordinates] = useState<number[]>([])
  const [userCreatedEvent, setUserCreatedEvent] = useState<string | undefined>('')

  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch<AppDispatch>()
  const {events}  = useSelector((state: { event: EventState }) => state.event);
 
  const handleMapClick2 = (event: any) => {
    const clickedCoordinates = [event.get('coords')[0], event.get('coords')[1]];
    setCoordinates(clickedCoordinates);
    setPlacemarkCoordinates([event.get('coords')[0], event.get('coords')[1]]);
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
      userCreatedEvent: userCreatedEvent
    };
    try {
      dispatch(addEvent(newEvent));
      dispatch(getAllEvents())
      alert('Событие успешно добавлено!')
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
    dispatch(getAllEvents());
    
  }, [dispatch, user?.email]);

  return (
    <div className='flex justify-center items-center'>
      <h1 className='font-bold pl-[30px]'>Создать событие</h1>
      <form onSubmit={handleSubmit}>
        <label >
          Заголовок
          <input className='mt-10' type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <br />
        <label>
          Описание:
          <input className='mt-10' type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <br />
        <label className='flex mt-10'>
          Тип местоположения:
          <input className='' type="text" value={locationType} onChange={(e) => setLocationType(e.target.value)} />
        </label>
        <br />
        <label>
          Адрес:
          <input className='mt-10' type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>
        <br />
        <label>
          Дата:
          <input className='mt-10' type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <br />
        <label>
          Категория:
          <input className='mt-4' type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        </label>
        <br />
        <button className='mt-4 mb-4 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300' type="submit">Создать событие</button>
      </form>
      <p  className='font-bold pl-[30px]'>Выберите место события:</p>
      <div className=''>
        <YMaps>
          <Map className=''
            defaultState={{ center: userLocation, zoom: 10 }}
            onClick={handleMapClick2}
            style={{ width: "500px", height: "500px" }}
          >
            {events && events.map((event:Event) => (
              <Placemark
                // key={event.id}
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
      </div>

    </div>
  );
};

export default CreateEvent;