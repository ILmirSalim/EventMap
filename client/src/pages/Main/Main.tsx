import React, { useState, useEffect } from "react";
import { YMaps, Map, Placemark, GeolocationControl } from "@pbe/react-yandex-maps";
import Footer from "../../components/Footer";

interface Event {
  id: number;
  name: string;
  description: string;
  location: [number, number];
  date: Date;
}

const MainPage: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);

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

  const handleMapClick = (event: any) => {
 
  };

  return (
    <div>
      <YMaps>
        <Map
          defaultState={{ center: userLocation, zoom: 10 }}
          onClick={handleMapClick}
          style={{ width: "500px", height: "500px" }}
        >
          {/* {events.map((event: Event) => (
          <Placemark key={event.id} geometry={event.location} />
        ))} */}
          <GeolocationControl options={{ float: "left" }} />
        </Map>
      </YMaps>
     
      <Footer />
    </div>

  );
};

export default MainPage;