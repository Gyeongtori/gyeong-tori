import React, { useEffect, useMemo, useState, useCallback } from "react";
import { GoogleMap, Circle, useJsApiLoader, MarkerF, MarkerClustererF } from "@react-google-maps/api";
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
    googleMapsApiKey: "AIzaSyAfcce2IjhzDkYHn7rZBilMDHw4f1c4IwU"
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
        // 정확도는 높지만 배터리 소모량up
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: Infinity
      });
    } else {
      alert('GPS를 지원하지 않습니다');
    }
  }, []);

  const getLocation = (event) => {
    // console.log('버튼 클릭')
    // console.log(event)
    console.log('count')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const latNow = position.coords.latitude
        const lngNow = position.coords.longitude
        console.log(latNow, lngNow)
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
  }

  const places = [
    ['1', 35.202018, 126.811782],
    ['2', 35.201121, 126.807993],
    ['3', 35.203164, 126.813467]
  ]

  // const places = [
  //   [ key = '1',
  //     lat = 35.202018, 
  //     lng = 126.811782],
  //   [ key = '2',
  //     lat = 35.201121,
  //     lng = 126.807993],
  //   [ key = '3',
  //     lat = 35.203164, 126.813467]
  // ]


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

        {/* 중심 레이더 옵션 */}
          <Circle center={center} options={circleRangeOptions} />
          <Circle center={center} options={markerCircleOptions} />

        {/* 문화재 마커 */}
          < MarkerClustererF options={{}}>
            {(clusterer) => (
              <>
                {places.map((place) => (
                  <MarkerF 
                    key={place[0]}
                    position={{lat: place[1], lng: place[2]}}
                    
                  />

                ))}
              </>
            )}
          </MarkerClustererF>

        {/* 메인기능 버튼 */}
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
