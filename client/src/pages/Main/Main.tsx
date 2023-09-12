import React, { useState, useEffect, useMemo, useCallback, ChangeEvent } from "react";
import { YMaps, Map, GeolocationControl, Placemark } from "@pbe/react-yandex-maps";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { EventState, Event } from './interfaces/Eventstate';
import { getAllEvents } from '../../redux/slices/eventSlice';
import { AppDispatch } from '../../redux/store/store'
import { searchEvents } from '../../redux/slices/eventSlice';
import Footer from "../../components/Footer";
import { wrapperBanner } from "./style";

const MainPage: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
  const [eventsFinded, setEventsFinded] = useState([])
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [distance, setDistance] = useState<number>();
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<Date | null>();
  const [dateEnd, setDateEnd] = useState<Date | null>();
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const { events } = useSelector(
    (state: { event: EventState }) => state.event,
    shallowEqual
  );

  const handleDistanceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDistance(e.target.valueAsNumber);
  };

  const handleTypesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(new Date(e.target.value));
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDateEnd(new Date(e.target.value));
  };
  const memoizedEvents = useMemo(() => events, [events]);
  const handleSearchClick = useCallback(async (
    category: string,
    startDate: Date | null,
    endDate: Date | null,
    distance: number
  ) => {
    try {
      const searchEvent = {
        category: category,
        startDate: startDate,
        endDate: endDate,
        distance: distance
      };

      const events = await dispatch(searchEvents(searchEvent));
      setEventsFinded(events.payload as never);
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllEvents());
    // getUserLocation();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error(error);
      }
    );
    setIsLoading(false);
  }, [dispatch]);
  console.log('eventsFinded', eventsFinded);

  if (userLocation === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex box-border justify-center">
        <YMaps>
          <Map
            className=""
            defaultState={{ center: userLocation, zoom: 10 }}
            style={{ width: "500px", height: "500px" }}
          > 
            {events && events.map((event: Event) => (
                <Placemark
                  key={event._id}
                  geometry={event.location.coordinates}
                  properties={{
                    balloonContent: `
                      <h2>Название:${event.title}</h2>
                      <p>Описание:${event.description}</p>
                      <p>Адрес события:${event.address}</p>
                      <p>День:${new Date(event.day).toLocaleDateString()}</p>
                      <p>Время:${event.time}(мск)</p>
                    `,
                  }}
                  options={{
                    iconColor: "green",
                    hideIconOnBalloonOpen: false,
                    balloonOffset: [3, -40],
                  }}
                  modules={["geoObject.addon.balloon"]}
                  onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.get("target").balloon.open();
                  }}
                />
              ))}
            {events?.length===0 && memoizedEvents &&
              memoizedEvents.map((event: Event) => (
                <Placemark
                  key={event._id}
                  geometry={event.location.coordinates}
                  properties={{
                    balloonContent: `
                      <h2>Название:${event.title}</h2>
                      <p>Описание:${event.description}</p>
                      <p>Адрес события:${event.address}</p>
                      <p>День:${new Date(event.day).toLocaleDateString()}</p>
                      <p>Время:${event.time}(мск)</p>
                    `,
                  }}
                  options={{
                    iconColor: "green",
                    hideIconOnBalloonOpen: false,
                    balloonOffset: [3, -40],
                  }}
                  modules={["geoObject.addon.balloon"]}
                  onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.get("target").balloon.open();
                  }}
                />
              ))}
            {userLocation && (
              <Placemark
                geometry={userLocation}
                options={{ preset: "islands#blueCircleDotIcon" }}
              />
            )}
            <GeolocationControl options={{ float: "left" }} />
          </Map>
        </YMaps>
        <div className={wrapperBanner}>
          <p className="ml-[50px] text-[20px] font-bold">
            Найдите интересные мероприятия поблизости!
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center mt-[20px] flex justify-center">
        <input className=' rounded-xl p-[5px] m-[5px] outline-none text-center'
          type='number'
          placeholder='Введите дистанцию(м)'
          onChange={handleDistanceChange}></input>
        <input className='rounded-xl p-[5px] m-[5px] outline-none text-center'
          type='text'
          placeholder='Тип события'
          onChange={handleTypesChange}></input>
        с
        <input className='rounded-xl p-[5px] m-[5px] outline-none text-center'
          type='date'
          placeholder='С даты'
          onChange={handleDateChange}></input>
        до
        <input className='rounded-xl p-[5px] m-[5px] outline-none hover:shadow-white text-center'
          type='date' placeholder='До даты'
          onChange={handleTimeChange}></input>
        <button onClick={() => handleSearchClick(category, date!, dateEnd!, distance!)}
          className="w-[150px] p-[4px] rounded-lg 
            bg-gradient-to-r from-green-400 
            to-cyan-400 w-full 
            hover:scale-110 transform transition-all duration-200">
          Найти события!
        </button>
      </div>
      <Footer />
    </div>
  );
};
export default MainPage;