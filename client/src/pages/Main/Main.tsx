import React, { useState, useEffect } from "react";
import { YMaps, Map, GeolocationControl } from "@pbe/react-yandex-maps";
import Footer from "../../components/Footer";
import { FilterEvents } from '../../components/Filter/FilterEvents';

const MainPage: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
  const [distanceFilter, setDistanceFilter] = useState<number>();
  const [typeFilter, setTypesFilter] = useState<string[]>();
  const [dateFilter, setDateFilter] = useState<Date>();
  const [timeFilter, setTimeFilter] = useState<number>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);
  if (userLocation == null) {
    return <div>Loading...</div>;
  }
  return (
    <div className="">
      <div className="flex">
        <YMaps >
          <Map
            defaultState={{ center: userLocation, zoom: 10 }}
            style={{ width: "500px", height: "500px" }}
            
          >
            <GeolocationControl options={{ float: "left" }} />
          </Map>
        </YMaps>
        <div className='ml-10'>Здесь будет баннер</div>
      </div>
      <FilterEvents
          setDistanceFilter={setDistanceFilter}
          setTypesFilter={setTypesFilter}
          setDateFilter={setDateFilter}
          setTimeFilter={setTimeFilter} />
      <Footer />
    </div>

  );
}; 

export default MainPage;