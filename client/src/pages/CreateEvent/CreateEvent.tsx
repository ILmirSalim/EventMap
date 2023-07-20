import React, { useEffect, useState } from 'react';
import { YMaps, Map, Placemark, GeolocationControl } from "@pbe/react-yandex-maps";
import { useDispatch, useSelector } from 'react-redux';
import { addEvent, getAllEvents } from '../../redux/slices/eventSlice';
import { AppDispatch, RootState } from '../../redux/store/store'
import { Event, EventState } from './interfaces';
// import { ToastContainer } from 'react-toastify';
// import { toast } from 'react-toastify';
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
  const { events } = useSelector((state: { event: EventState }) => state.event);
  const ENDPOINT = 'http://localhost:3002';
  const socket = socketIOClient(ENDPOINT);
  const handleMapClick2 = (event: any) => {
    const clickedCoordinates = [event.get('coords')[0], event.get('coords')[1]];
    setCoordinates(clickedCoordinates);
    setPlacemarkCoordinates([event.get('coords')[0], event.get('coords')[1]]);
  };
  const point = "Point"
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      // location: {
      //   coordinates: coordinates,
      // },
      // coordinates: coordinates,
      address: address,
      day: day,
      time: time,
      category: category,
      userCreatedEvent: userCreatedEvent
    };

    try {
      dispatch(addEvent(newEvent));
      dispatch(getAllEvents())
      socket.emit('create event', newEvent)
      // toast.success('Событие успешно добавлено!');
      // alert('Событие успешно добавлено!')
      setShowNotification(true)
      console.log(newEvent);
      
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

  useEffect(() => {
    const handleEvent = () => {
      // setMessages((prevMessages) => [...prevMessages, msg]);  
    //   toast.info('New message received'); 
      setShowNotification(true)         
    };
    
    socket.on('create event', handleEvent);
    
    console.log('Listening to chat message!');
    
    return () => {
      console.log('Stopping listening to chat message!');
      socket.off('create event', handleEvent);
    };
    // socket.on('create event', (event) => {
    //   if (event) {
    //     setShowNotification(true)
    //   }
      
    // });
  
    // return () => {
    //   socket.disconnect(); // Очистка путем отключения сокета при размонтировании компонента
    // };
  }, [showNotification, socket]);

  useEffect(() => {
    if (showNotification) {
        const timeout = setTimeout(() => {
            setShowNotification(false);
        }, 10000);

        return () => {
            clearTimeout(timeout);
        };
    }
}, [showNotification]);

  return (
    <div className='flex justify-center items-center ml-[-70px]'>
      <div>
        
        <h1 className='font-bold pl-[-10px]'>Введите данные о событии:</h1>
        <form onSubmit={handleSubmit}>
          <label className=''>
            Заголовок:
            <input className='mt-[10px] ml-[10px] rounded-xl outline-none' type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <br />
          <label>
            Описание:
            <input className='mt-[10px] ml-[10px] rounded-xl outline-none' type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <br />
          <label className='flex mt-[10px] mb-[-12px] '>
            Тип местоположения:
            <input className='ml-[10px]  rounded-xl outline-none' type="text" value={locationType} onChange={(e) => setLocationType(e.target.value)} />
          </label>
          <br />
          <label>
            Адрес:
            <input className='ml-[10px] rounded-xl outline-none' type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>
          <br />
          <label>
            Дата:
            <input className='mt-[10px] ml-[10px] rounded-xl outline-none' type="date" value={day} onChange={(e) => setDay(e.target.value)} />
          </label>
          <br />
          <label >
            Время события:
            <input className='ml-[10px] mt-[10px] rounded-xl outline-none' type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
          <br />
          <label>
            Категория:
            <input className='ml-[10px] mt-4 rounded-xl outline-none' type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
          </label>
          <br />
          <button
            className='mt-4 mb-4 bg-gradient-to-r from-green-400 to-cyan-400  
            hover:text-white active:bg-violet-700 focus:outline-none 
            focus:ring focus:ring-violet-300 rounded-xl outline-none p-[5px]'
            type="submit">Создать событие</button>
        </form>
      </div>

      <div className='ml-[30px]'>
        <div className='block mb-[10px]'>
          <p className='font-bold pl-[10px]'>Выберите место события:</p>
          <p className='font-bold pl-[10px]'>*кликните по карте</p>
        </div>
        <div className=''>
          <YMaps>
            <Map className=''
              defaultState={{ center: userLocation, zoom: 10 }}
              onClick={handleMapClick2}
              style={{ width: "500px", height: "500px" }}
            >
              {events && events.map((event: Event) => (
                <Placemark
                  geometry={event.location.coordinates}
                  properties={{
                    balloonContent: `
                  <h2>Название:${event.title}</h2>
                  <p>Описание:${event.description}</p>
                  <p>Адрес события:${event.address}</p>
                  <p>День:${event.day}</p>
                  <p>Время:${event.time}</p>
                `,
                  }}
                  options={{
                    iconColor: "green",
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
      {showNotification && (
    <div style={{ position: 'fixed', bottom: 20, right: 20, padding: 10, background: 'gray', color: 'white' }}>
        Событие успешно добавлено!
    </div>
)}
    </div>
  );
};

export default CreateEvent;