import React, { useEffect, useMemo, useState, useCallback } from "react";
import { GoogleMap, Circle, useJsApiLoader, MarkerF, MarkerClustererF } from "@react-google-maps/api";
import styled from "styled-components";
import InfoTop from "../components/Mains/InfoTop";
import { Sample1 } from "../components/Styles/MapStyles"
import axios from "axios";
import { useNavigate } from "react-router-dom";

const google = window.google = window.google ? window.google : {}

// 경주 { lat: 35.831490, lng: 129.210748 }
// 전대 { lat: 35.175595, lng: 126.907032 }
// 싸피 { lat: 35.205231, lng: 126.8117628 }

export default function Maps () {
  const [map, setMap] = useState(null);

  // 경주 기준점
  // const [center, setCenter] = useState({ lat: 35.831490, lng: 129.210748 });
  
  // 전대 기준점
  const [center, setCenter] = useState({ lat: 35.205231, lng: 126.8117628 });
  const [mapCenter, setMapCenter] = useState()
  const [head, setHead] = useState()

  const [showSemiCircle, setShowSemiCircle] = useState(false);

  const navigate = useNavigate();
 

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    // googleMapsApiKey: 'AIzaSyAfcce2IjhzDkYHn7rZBilMDHw4f1c4IwU',
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
       
        const headNow = position.coords.heading;
        if (headNow !== null) {
          setHead(headNow);
          console.log(headNow, '현재 방향을 받아왔어요');
        } else {
          console.log('방향 정보를 받아오지 못했습니다');
        }
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
    console.log('count')

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
  }

// 마크 클릭 이벤트
  const goGetCard = (event) => {
    console.log(event)
    navigate("/camera", {
      state: {
        cultural_heritage_id: `${event.cultural_heritage_id}`,
        lat: `${event.lat}`,
        lng: `${event.lng}`,
        address : `${event.address}` 
      }
    });
    
  }

  const places = [
    {cultural_heritage_id: '1', lat: 35.205244, lng: 126.810495,address : " 광주광역시 광산구 오선동 549-1번지",},
    {cultural_heritage_id: '2', lat: 35.205080, lng: 126.810211, address : " 광주광역시 광산구 오선동 549-1번지",},
    {cultural_heritage_id: '3', lat: 35.205309, lng: 126.807715 , address : " 광주광역시 광산구 오선동 271번지",},
    {cultural_heritage_id: '4', lat: 35.197128, lng: 126.803582, address : " 광주광역시 광산구 장덕동 971-3",},
    {cultural_heritage_id: '5', lat: 35.199092, lng: 126.814761, address : " 광주광역시 광산구 수완동 풍영로 313",}
  ]

  // 문화재 요청
  const [api, setApi] = useState()

  useEffect(() => {
    getAPI();
  }, []);
    
  const getAPI = async () => {
    try {
      // res에는 결과 값이 담겨옴
      const res = await axios.post("v1/culturalheritage/list", {
              'lat' : `${center.lat}`,
              'lng' : `${center.lng}` }
      // {headers: {
      //   'Content-Type': `application/json`,
      //   'ngrok-skip-browser-warning': '69420',
      // }},
      );
      setApi(res? [...res.data.data_body, ...places] : [...places])
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
    radius: 80,
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
                    onClick={()=> {goGetCard(place)}}
                    
                    // icon={{
                    //   href: require("../public/markerSample1.png"),
                    //   url: "https://img.freepik.com/premium-vector/funny-pussy-kitty-cat-character-in-kawaii-cartoon-style_835197-15967.jpg",
                    //   scaledSize: new google.maps.Size(50, 50),
                    //   origin: new google.maps.Point(0, 0),
                    //   anchor: new google.maps.Point(25, 50),
                    // }}
                    />
                    
                    ))}
              </>
            )}
          </MarkerClustererF>


        {/* 메인기능 버튼 */}
          <Body>
            {/* <video autoPlay style={cameraStyles.Video} /> */}
            <InfoTop 
              center={center}
            ></InfoTop>
            <button onClick={getLocation}>버튼</button>
            <div>{head && head }방향정보~</div>
          </Body>

          <Body>
            <Testt>
              <ToggleButton onClick={() => setShowSemiCircle(!showSemiCircle)}>
                토글
              </ToggleButton>
              <SemiCircle show={showSemiCircle}>
                <div>
                  <SemiCircleButton>버튼 1</SemiCircleButton>
                </div>
                <div>
                  <SemiCircleButton>버튼 2</SemiCircleButton>
                  <SemiCircleButton>버튼 3</SemiCircleButton>
                </div>
              </SemiCircle>
            </Testt>
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

const ToggleButton = styled.button`
  z-index: 50;
`;

const SemiCircle = styled.div`
z-index: 20;
  position: absolute;
  bottom: -150px;
  left: 50%;
  transform: translateX(-50%) ${props => props.show ? 'translateY(0)' : 'translateY(100%)'}; // 위로 올라오는 애니메이션 추가
  width: 120%;
  height: 400px;
  background: rgb(114, 161, 111, 0.5);
  border-radius: 100% 100% 0 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  transition: all 0.5s ease-in-out;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
`;

const SemiCircleButton = styled.button`
  flex: 1;
  height: 50%;
  background-color: #72A16F; // 배경색 설정
  border-radius: 50%; // 원 모양 만들기
  border: none; // 기본 테두리 제거
`;


const Testt = styled.div`
  position: fixed;
  bottom: 0px;
  left: 50%;
`;