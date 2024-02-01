import React, { useEffect, useMemo, useState, useCallback } from "react";
import { GoogleMap, Circle, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import styled from "styled-components";
import InfoTop from "../components/Mains/InfoTop";
import { Sample1 } from "../components/Mains/MapStyles"

const google = window.google = window.google ? window.google : {}

export default function Maps () {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 35.175595, lng: 126.907032 });
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });


  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) { 
      navigator.geolocation.watchPosition(function(position) {
        const latNow = position.coords.latitude;
        const lngNow = position.coords.longitude;
        console.log(latNow, lngNow);
        setCenter({lat: latNow, lng: lngNow});
      }, function(error) {
        console.error(error);
      }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: Infinity
      });
    } else {
      alert('GPS를 지원하지 않습니다');
    }
  }, []);

  const getLocation = (event) => {
    console.log('버튼 클릭')
    console.log(event)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const latNow = position.coords.latitude
        const lngNow = position.coords.longitude
        console.log(latNow, lngNow)
        setCenter({lat: latNow, lng: lngNow});
      }, function(error) {
        console.error(error);
      }, {
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: Infinity
      });
    } else {
      alert('GPS를 지원하지 않습니다');
    }
  }

  const circleRangeOptions = {
    strokeColor: '#FF7575',
    strokeOpacity: 0,
    strokeWeight: 0,
    fillColor: '#C779D0',
    fillOpacity: 0.35,
    radius: 100,
    center,
  };

  const markerCircleOptions = {
    strokeColor: '#FFFFFF',
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: '#C779D0',
    fillOpacity: 0.5,
    radius: 10,
    center,
  };

  if ( !isLoaded ) return <div>Loading...</div>

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ position: 'relative' }}>
        <GoogleMap 
          zoom={17} 
          center={center} 
          mapContainerClassName="map-container"
          onUnmount={onUnmount}
          options={{
            styles: Sample1,
            // 기본 ui 요소 지우기
            disableDefaultUI: true, 
            minZoom: 16, 
            maxZoom: 18,
          }}
          mapContainerStyle={{ width: '100%', height: '100vh' }}
        > 
          <Circle center={center} options={circleRangeOptions} />
          <Circle center={center} options={markerCircleOptions} />
          <Body>
            <button onClick={getLocation}>버튼</button>
            <InfoTop ></InfoTop>
          </Body>
        </GoogleMap>
      </div>
    </div>
  )
}

const Body = styled.div`
  width: 100%;
  position: absolute;
  z-index: 10;
`;
