import React, { useEffect, useMemo, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import styled from "styled-components";
import InfoTop from "../components/Mains/InfoTop";

// 위도 경도 sample
// 서울 : 37.566535   126.8154368
// 싸피 : 35.205216   126.811744
// 전대 : 35.175595   126.907032


export default function Maps () {
  
  // const center = {lat: 35.175595 , lng: 126.907032 }

  const [map, setMap] = useState(null);
	const [center, setCenter] = useState({ lat: 35.175595, lng: 126.907032 });
	const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });


  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAfcce2IjhzDkYHn7rZBilMDHw4f1c4IwU"
  });

  if ( !isLoaded ) return <div>Loading...</div>

  const locateUser = useCallback(() => {
		if (center.lat && center.lng) {
			const newLocation = {
				lat: center.lat,
				lng: center.lng,
			};
			setMapCenter(newLocation);
			if (map) {
				map.panTo(newLocation);
				map.setZoom(18);
			}
		}
	}, [center.lat, center.lng, map]);

	const onUnmount = useCallback(function callback() {
		setMap(null);
	}, []);
  

  const getLocation = () => {
    if (navigator.geolocation) { // GPS를 지원하면
      navigator.geolocation.getCurrentPosition(function(position) {
        const latNow = position.coords.latitude
        const lngNow = position.coords.longitude
        console.log(latNow, lngNow)
        // setCurrentPosition({x: latNow, y: lngNow})
  
        // alert(position.coords.latitude + ' ' + position.coords.longitude);
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



  // useEffect(() => {
  //   getLocation();
  // }, [])
  
  getLocation();


  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ position: 'relative' }}>
        <GoogleMap 
          zoom={18} 
          center={center} 
          mapContainerClassName="map-container"
          
          // 기본 ui 요소 지우기
          options={{disableDefaultUI: true}}

          mapContainerStyle={{ width: '100%', height: '100vh' }}
        > 
          <MarkerF position={center} />
          <Test>
            <InfoTop ></InfoTop>
            <button onClick={() => getLocation()} >버튼</button>
          </Test>
          
          
  
        </GoogleMap>

      </div>
    </div>
  )
}

const Test = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;

`;








