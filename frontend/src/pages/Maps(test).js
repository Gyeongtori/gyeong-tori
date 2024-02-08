import React, { useEffect, useMemo, useState, useCallback } from "react";
import { GoogleMap, Circle, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import styled from "styled-components";
// import InfoTop from "../components/Mains/InfoTop";

// 위도 경도 sample
// 서울 : 37.566535   126.8154368
// 싸피 : 35.205216   126.811744
// 전대 : 35.175595   126.907032

const google = window.google = window.google ? window.google : {}

export default function Maps () {
  
  // const center = {lat: 35.175595 , lng: 126.907032 }

  const [map, setMap] = useState(null);
  // 전대 기준
	const [center, setCenter] = useState({ lat: 35.175595, lng: 126.907032 });
	const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });


  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAfcce2IjhzDkYHn7rZBilMDHw4f1c4IwU"
  });

  
// ???
  const locateUser = useCallback(() => {
		if (center.lat && center.lng) {
			const newLocation = {
        lat: center.lat,
				lng: center.lng,
			};
      console.log('newLocation: ', newLocation);
			setCenter(newLocation);
			if (map) {
				map.panTo(newLocation);
				map.setZoom(18);
			}
		}
	}, [center.lat, center.lng, map]);

  const onUnmount = useCallback(function callback() {
		// 컴포넌트가 언마운트될때 호출 map 상태 변수를 null로 설정하여 초기화
		setMap(null);
	}, []);

// ㅇㅂㅇ
const UserTracking = (event) => {
  if (navigator.geolocation) { // GPS를 지원하면
    navigator.geolocation.watchPosition(function(position) {
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

// 내위치 업데이트
  const getLocation = (event) => {
    console.log('버튼 클릭')
    console.log(event)
    if (navigator.geolocation) { // GPS를 지원하면
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



  // useEffect(() => {
  //   getLocation();
  // }, [])
  
  // getLocation();

  // 내 위치 표시 range
  const circleRangeOptions = {
		strokeColor: '#FF7575',
		strokeOpacity: 0,
		strokeWeight: 0,
		fillColor: '#C779D0',
		fillOpacity: 0.35,
		radius: 100,
		center,
	};

  // 내 특정 위치 표시
  const markerCircleOptions = {
		strokeColor: '#FFFFFF',
		strokeOpacity: 1,
		strokeWeight: 2,
		fillColor: '#C779D0',
		fillOpacity: 1,
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
          // 기본 ui 요소 지우기
          options={{disableDefaultUI: true, }}

          mapContainerStyle={{ width: '100%', height: '100vh' }}
        > 
          {/* <MarkerF position={center} /> */}
          <Circle center={center} options={circleRangeOptions} />
          <Circle center={center} options={markerCircleOptions} />
          <Body>
            <button onClick={() => getLocation()} >버튼</button>
            {/* <InfoTop ></InfoTop> */}
          </Body>
          
  
        </GoogleMap>

          
      </div>
    </div>
  )
}

const Body = styled.div`
  width: 100%;
  /* height: 100%; */
  position: absolute;
  z-index: 10;

`;








