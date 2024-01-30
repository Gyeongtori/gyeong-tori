import React, { useEffect, useMemo } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

// 위도 경도 sample
// 서울 : 37.566535   126.8154368
// 싸피 : 35.205216   126.811744
// 전대 : 35.175595   126.907032


export default function Maps () {
  const { isLoaded } = useJsApiLoader({
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
  


  const center = {lat: 35.175595 , lng: 126.907032 }
  

  // useEffect(() => {
  //   getLocation();
  // }, [])
  
  getLocation();


  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ position: 'relative' }}>
        <div style={{zIndex: 10, backgroundColor: '#FFAAAA'}}>testtttttttt</div>
  
        <GoogleMap 
          zoom={18} 
          center={center} 
          mapContainerClassName="map-container"
          
          // 기본 ui 요소 지우기
          options={{disableDefaultUI: true}}

          mapContainerStyle={{ width: '100%', height: '100vh', position: 'absolute' }}
        > 
          <MarkerF position={center} />
          <div style={{ position: 'absolute', backgroundColor: '#FFAAAA', zIndex: 10}}>Testtesttest</div>
          <button onClick={() => getNow()} style={{ position: 'absolute', zIndex: 10 }}>버튼</button>
          {/* <div>제발나와라ㅏㅏ아아아ㅏ아앙</div>
          <div>제발나와라ㅏㅏ아아아ㅏ아앙</div>
          <div>제발나와라ㅏㅏ아아아ㅏ아앙</div>
          <div>제발나와라ㅏㅏ아아아ㅏ아앙</div> */}
          
          <div style={{width: '100%', height: '100%', position: 'absolute', zIndex: 10}}>제발나와라ㅏㅏ아아아ㅏ아앙</div>
        </GoogleMap>

      </div>
    </div>
  )
}








