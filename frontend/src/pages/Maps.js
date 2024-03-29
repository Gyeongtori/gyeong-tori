import React, { useEffect, useState, useCallback } from "react";
import {
  GoogleMap,
  Circle,
  useJsApiLoader,
  MarkerF,
  MarkerClustererF,
} from "@react-google-maps/api";
import styled from "styled-components";
import InfoTop from "../components/Mains/InfoTop";
import useStore from "../stores/store";
import { Sample1 } from "../components/Styles/MapStyles";
import { IoSettingsOutline } from "react-icons/io5";
import { GiHandBag } from "react-icons/gi";
import { RiBoxingLine } from "react-icons/ri";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import mapBtn from "../assets/mapBtn.png";
import Pin from "../assets/pinPoint.png";
const google = (window.google = window.google ? window.google : {});

// 경주 { lat: 35.831490, lng: 129.210748 }
// 전대 { lat: 35.175595, lng: 126.907032 }
// 싸피 { lat: 35.205231, lng: 126.8117628 }

export default function Maps() {
  // const [map, setMap] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const location = useLocation();
  const language = location.state ? location.state.language : '한국어';
  // console.log('지도 language: ', language);



  // 경주 기준점
  // const [center, setCenter] = useState({ lat: 35.831490, lng: 129.210748 });

  // 싸피 기준점
  const [center, setCenter] = useState({ lat: 35.205231, lng: 126.8117628 });
  const [head, setHead] = useState();

  const [showSemiCircle, setShowSemiCircle] = useState(false);

  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`,
    language: language==='English' ? "en": "ko"
  });

  // const onUnmount = useCallback(function callback() {
  //   setMap(null);
  // }, []);

  const goProfile = () => {
    navigate("/profile");
  };

  const goCard = () => {
    navigate("/cards");
  };

  const goBattle = () => {
    navigate("/battle");
  };

  const goRecommend = () => {
    if (window.confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")) {
      navigate('/');
    } 
  }


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        function (position) {
          const latNow = position.coords.latitude;
          const lngNow = position.coords.longitude;

          // console.log(latNow, lngNow, "현재위치 받아왔어요");
          setCenter({ lat: latNow, lng: lngNow });

          const headNow = position.coords.heading;
          if (headNow !== null) {
            setHead(headNow);
            // console.log(headNow, "현재 방향을 받아왔어요");
          } else {
            // console.log("방향 정보를 받아오지 못했습니다");
          }
        },
        function (error) {
          console.error(error);
        },
        {
          // 정확도는 높지만 배터리 소모량up
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: Infinity,
        }
      );
    } else {
      alert("GPS를 지원하지 않습니다");
    }
  }, []);

  const [disApi, setDisApi] = useState();

  useEffect(() => {
    // 내근처 문화재만 탐색
    getDisAPI();
  }, [center]);

  const getDisAPI = async () => {
    try {
      const res = await axios.post("v1/culturalheritage/distance", {
        lat: `${center.lat}`,
        lng: `${center.lng}`,
      });
<<<<<<< HEAD
      // console.log(res.data.data_body, '내 주변 문화재')
      let distanceAPI = res.data.data_body
      
      if (JSON.stringify(distanceAPI) !== JSON.stringify(disApi)){
        setDisApi(distanceAPI);
      }
      
=======
      let distanceAPI = res.data.data_body;

      setDisApi(res.data.data_body);
>>>>>>> 9b4fd3ab3c16abacdf5d3c25ffc7bde9643cff7a
    } catch (e) {
      console.log(e.response);
    }
  };


  const getAddress = async (getlat, getlng) => {
    try {
      // res에는 결과 값이 담겨옴
      const res = await axios.get(
        `/req/address?service=address&request=getAddress&version=2.0&crs=epsg:4326&point=${getlng},${getlat}&type=both&zipcode=true&simple=false&key=${process.env.REACT_APP_SIDO_KEY}`
      );
      if (res.status === 401) {
        useStore.getState().updateToken();
        getAddress();
      }


      // 임시 해결로 바로 데이터 전송함
      return res.data.response.result[0].text;
    } catch (error) {
      console.log(error);
    }
  };

<<<<<<< HEAD
=======
  // 마크 클릭 이벤트
  const goGetCard = async (event) => {

    const address = await getAddress(event.lat, event.lng);
    navigate("/camera", {
      state: {
        cultural_heritage_id: `${event.no}`,
        lat: `${event.lat}`,
        lng: `${event.lng}`,
        address: `${address}`,
      },
    });
  };

>>>>>>> 9b4fd3ab3c16abacdf5d3c25ffc7bde9643cff7a
  // 문화재 요청
  const [api, setApi] = useState();

  useEffect(() => {
    getAPI();
  }, []);

  const getAPI = async () => {
    try {
      // res에는 결과 값이 담겨옴
      const res = await axios.get("/v1/culturalheritage/list", {
        lat: `${center.lat}`,
        lng: `${center.lng}`,
      });
      if (res.status === 401) {
        useStore.getState().updateToken();
        getAPI();
      }
      setApi(res.data.data_body);
    } catch (e) {
      console.log(e.response);
    }
  };


  const circleRangeOptions = {
    strokeColor: "#FFFFFF",
    strokeOpacity: 0.35,
    strokeWeight: 40,
    fillColor: "#F2A55D",
    fillOpacity: 0.5,
    zIndex: 10,
  };

  const markerCircleOptions = {
    strokeColor: "#FFFFFF",
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: "#F2A55D",
    fillOpacity: 0.35,
    radius: 10,
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ position: "relative" }}>
        <GoogleMap
          zoom={7}
          center={center}
          mapContainerClassName="map-container"
          // onUnmount={onUnmount}
          options={{
            styles: Sample1,
            // 기본 ui 요소 지우기
            disableDefaultUI: true,
            // minZoom: 16,
            // maxZoom: 17,
          }}
          mapContainerStyle={{ width: "100%", height: "100vh" }}
        >
          {/* 중심 레이더 옵션 */}
          <Circle center={center} options={circleRangeOptions} radius={80} />
          {/* <Circle center={center} options={markerCircleOptions} /> */}

          {/* 문화재 마커 */}
          <MarkerClustererF options={{}}>
            {(clusterer) => (
              <>
                {disApi &&
                  disApi.map((place) => (
                    <MarkerF
                      key={place.no}
                      position={{
                        lat: Number(place.lat),
                        lng: Number(place.lng),
                      }}
                      onClick={() => {
                        goGetCard(place);
                      }}
                      icon={{
                        url: `${Pin}`,
                        // url: place.image_source,
                        scaledSize: new google.maps.Size(50, 50),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(25, 50),
                      }}
                    />
                  ))}
              </>
            )}
          </MarkerClustererF>

          {/* 메인기능 버튼 */}
          <Body>
            <InfoTop center={center}></InfoTop>
          </Body>

          <Body>
            {user ? <Testt id="test1">
              <ToggleButton
                onClick={() => setShowSemiCircle(!showSemiCircle)}
              />
              <SemiCircle show={showSemiCircle}>
                <div>
                  <SemiCircleButton>
                    <RiBoxingLine onClick={goBattle} size={35} />
                  </SemiCircleButton>
                </div>
                <div>
                  <SemiCircleButton>
                    <GiHandBag onClick={goCard} size={35} />
                  </SemiCircleButton>
                  <SemiCircleButton>
                    <IoSettingsOutline size={35} onClick={goProfile} />
                  </SemiCircleButton>
                </div>
              </SemiCircle>
            </Testt> 
            : <div>
              <Testt>
                <ToggleButton
                  onClick={goRecommend}
                  />
              </Testt>
            </div>
              }
            
          </Body>
        </GoogleMap>
      </div>

      <div></div>
    </div>
  );
}

const Body = styled.div`
  width: 100%;
  position: absolute;
  z-index: 10;
`;

const ToggleButton = styled.button`
  position: absolute;
  bottom: 20px;
  z-index: 50;
  left: -35px;

  width: 70px;
  height: 70px;
  border-radius: 50%;

  background-image: url(${mapBtn});
  background-size: cover;
  background-repeat: no-repeat;
  border: none;
`;

const SemiCircle = styled.div`
  position: relative;
  bottom: -100px;
  transform: translateX(-50%)
    ${(props) => (props.show ? "translateY(0)" : "translateY(100%)")};
  width: 500px;
  height: ${(props) => (props.show ? "350px" : "0")};
  background: rgb(114, 161, 111, 0.5);
  border-radius: 100% 100% 0 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.7s ease-in-out;
  opacity: ${(props) => (props.show ? 1 : 0)};
  visibility: ${(props) => (props.show ? "visible" : "hidden")};

  div:first-child {
    align-self: center;
  }

  div:last-child {
    display: flex;
    justify-content: space-around;
    width: 100%;
    padding: 10px 20px;
    margin-bottom: 80px;
  }
`;

const SemiCircleButton = styled.button`
  width: 80px;
  height: 80px;
  border: 1px solid #72a16f;
  background-color: #f0f4ef;
  border-radius: 50%;
  border: 2px solid #72a16f;
`;

const Testt = styled.div`
  position: fixed;
  bottom: 0px;
  left: 50%;
`;
