import React, { useEffect, useMemo, useState, useCallback } from "react";
import { GoogleMap, Circle, useJsApiLoader, MarkerF, MarkerClustererF } from "@react-google-maps/api";
import styled from "styled-components";
import InfoTop from "../components/Mains/InfoTop";
import { Sample1 } from "../components/Mains/MapStyles"
import axios from "axios";

import convert from 'xml-js';
// import parser from 'fast-xml-parser';

const google = window.google = window.google ? window.google : {}

// 경주 { lat: 35.831490, lng: 129.210748 }
// 전대 { lat: 35.175595, lng: 126.907032 }
// 싸피 { lat: 35.205231, lng: 126.8117628 }

export default function Maps () {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 35.831490, lng: 129.210748});
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [head, setHead] = useState()

 

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

        console.log(latNow, lngNow,'현재위치 받아왔어요')
        setCenter({lat: latNow, lng: lngNow});
        console.log(center, '센터인데 지금은')
        const headNow = position.coords.heading
        setHead(headNow)
        // console.log(head, 'headdddd')
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
        console.log(latNow, lngNow, '클릭이벤트')
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


  const goGetCard = () => {
    console.log('클릭클릭')
  }

  const places = [
    {no: '1', lat: 35.202018, lng: 126.811782},
    {no: '2', lat: 35.201121, lng: 126.807993},
    {no: '3', lat: 35.203164, lng: 126.813467}
  ]

  // 문화재 요청
  const [api, setApi] = useState();	
  
  useEffect(() => {
    getAPI();
  }, []);
    
  const getAPI = async () => {
    try {
      // res에는 결과 값이 담겨옴
      const res = await axios.get("v1/culturalheritage/list", 
      {headers: {
        'Content-Type': `application/json`,
        'ngrok-skip-browser-warning': '69420',
      }},);
      setApi(res.data.data_body)
      // console.log('api 정보 조회', api)

    } catch (e) {
      console.log(e.response);
    }
  };
  
    /* {no, asno, name_kr, name_hanja, content, sido_name, gugun_name,
             division, lng, lat, image_source, image_detail, narration, video_source} */

  





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
            // minZoom: 16, 
            // maxZoom: 18,
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
                {api && api.map((place) => (
                  <MarkerF 
                    key={place.no}
                    position={{lat: Number(place.lat), lng: Number(place.lng)}}
                    onClick={() => {getLocation()}}
                    // onClick={startOrStop()}
                    />
                    
                    ))}
              </>
            )}
          </MarkerClustererF>

        {/* 메인기능 버튼 */}
          <Body>
            {/* <video autoPlay style={cameraStyles.Video} /> */}
            <button onClick={getLocation}>버튼</button>
            <InfoTop 
              center={center}
            ></InfoTop>
          </Body>

        </GoogleMap>

      </div>


      <div>
        
      </div>
    </div>
  )
}

const Body = styled.div`
  width: 100%;
  position: absolute;
  z-index: 10;
`;


