import React, { useMemo } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import styled from "styled-components";

// 위도 경도 sample
// 서울 : 37.566535   126.8154368
// 싸피 : 35.205216   126.811744
// 전대 : 35.175595   126.907032


export default function Test () {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAfcce2IjhzDkYHn7rZBilMDHw4f1c4IwU"
  });

  if ( !isLoaded ) return <div>Loading...</div>

  

  const getNow = () => {
    if (navigator.geolocation) { // GPS를 지원하면
      navigator.geolocation.getCurrentPosition(function(position) {
        const latNow = position.coords.latitude
        const lngNow = position.coords.longitude
        console.log(latNow, lngNow)
  
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


  return (
    <div>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', backgroundColor: '#FFAAAA', zIndex: 10}}>Testtesttest</div>
        <Map style={{ opacity : 0.2}}>

        </Map>
        <button onClick={() => getNow()} style={{ position: 'absolute' }}>버튼</button>
      </div>
    </div>
  )

}

function getLocation() {
  if (navigator.geolocation) { // GPS를 지원하면
    navigator.geolocation.getCurrentPosition(function(position) {
      const latNow = position.coords.latitude
      const lngNow = position.coords.longitude
      console.log(latNow, lngNow)

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
getLocation();




const Map = (latNow, lngNow) => {
  const center = useMemo(() => ({lat: 35.175595 , lng: 126.907032 }), [])
  // const center = useMemo(() => ({lat: latNow , lng: lngNow }), [])


  return (
  <GoogleMap 
    zoom={18} 
    center={center} 
    mapContainerClassName="map-container"
    
    // 기본 ui 요소 지우기
    options={{disableDefaultUI: true}}
  > 
    <MarkerF position={center} />
  </GoogleMap>)
}

