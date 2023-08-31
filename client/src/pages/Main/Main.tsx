import React, { useState, useEffect, useMemo, useCallback} from "react";
import { YMaps, Map, GeolocationControl, Placemark } from "@pbe/react-yandex-maps";
import Footer from "../../components/Footer";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { EventState, Event } from './interfaces/Eventstate';
import FilterEvents  from '../../components/Filter/FilterEvents';
import { addEvent, getAllEvents } from '../../redux/slices/eventSlice';
import { AppDispatch, RootState } from '../../redux/store/store'
import { wrapperBanner } from "./style";

const MainPage: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [placemarkCoordinates, setPlacemarkCoordinates] = useState<number[]>([])
  const [distanceFilter, setDistanceFilter] = useState<number>();
  const [typeFilter, setTypesFilter] = useState<string[]>();
  const [dateFilter, setDateFilter] = useState<Date>();
  const [timeFilter, setTimeFilter] = useState<number>();

  const { events } = useSelector(
    (state: { event: EventState }) => state.event,
    shallowEqual
  );
  const memoizedEvents = useMemo(() => events, [events]);

  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  
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
            {memoizedEvents &&
              memoizedEvents.map((event: Event) => (
                <Placemark
                  key={event._id}
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
                  modules={["geoObject.addon.balloon"]}
                  onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.get("target").balloon.open();
                  }}
                />
              ))}

            {placemarkCoordinates && (
              <Placemark geometry={placemarkCoordinates} />
            )}
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
      <FilterEvents
        setDistanceFilter={setDistanceFilter}
        setTypesFilter={setTypesFilter}
        setDateFilter={setDateFilter}
        setTimeFilter={setTimeFilter}
      />
      <Footer />
    </div>
  );
};
export default MainPage;