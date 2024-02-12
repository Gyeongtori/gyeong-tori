import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  GoogleMap,
  Circle,
  useJsApiLoader,
  MarkerF,
  MarkerClustererF,
} from "@react-google-maps/api";
import styled from "styled-components";
import InfoTop from "../components/Mains/InfoTop";
import { Sample1 } from "../components/Styles/MapStyles";
import { IoSettingsOutline } from "react-icons/io5";
import { GiHandBag } from "react-icons/gi";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import mapBtn from "../assets/mapBtn.png";
const google = (window.google = window.google ? window.google : {});

// 경주 { lat: 35.831490, lng: 129.210748 }
// 전대 { lat: 35.175595, lng: 126.907032 }
// 싸피 { lat: 35.205231, lng: 126.8117628 }

export default function Maps() {
  const [map, setMap] = useState(null);

  // 경주 기준점
  // const [center, setCenter] = useState({ lat: 35.831490, lng: 129.210748 });

  // 전대 기준점
  const [center, setCenter] = useState({ lat: 35.175595, lng: 126.907032 });

  const [mapCenter, setMapCenter] = useState();
  const [head, setHead] = useState();

  const [showSemiCircle, setShowSemiCircle] = useState(false);

  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    // googleMapsApiKey: "AIzaSyBZrBxO1en2t7fU6-47ooo_DxPyeTF4Xi8",
    language: "KR",
  });

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const options = {
    zoom: 16,
    // mapTypeId: 'satellite' // 위성 뷰로 지정
  };

  const onLoad = useCallback((map) => {
    map.setCenter(center);
    map.setOptions(options);
    map.setHeading(90);
  }, []);

  const goProfile = () => {
    navigate("/profile");
  };

  const goCard = () => {
    navigate("/cards");
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        function (position) {
          const latNow = position.coords.latitude;
          const lngNow = position.coords.longitude;

          console.log(latNow, lngNow, "현재위치 받아왔어요");
          setCenter({ lat: latNow, lng: lngNow });

          const headNow = position.coords.heading;
          if (headNow !== null) {
            setHead(headNow);
            console.log(headNow, "현재 방향을 받아왔어요");
          } else {
            console.log("방향 정보를 받아오지 못했습니다");
          }
        },
        function (error) {
          console.error(error);
        },
        {
          // 정확도는 높지만 배터리 소모량up
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: Infinity,
        }
      );
    } else {
      alert("GPS를 지원하지 않습니다");
    }
  }, []);

  const getLocation = useCallback(() => {
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

  // 마크 클릭 이벤트
  const goGetCard = (event) => {
    console.log(event);
    navigate("/camera", {
      state: {
        cultural_heritage_id: `${event.no}`,
        lat: `${event.lat}`,
        lng: `${event.lng}`,
        address: `${event.address}`,
      },
    });
  };

  const places = [
    {
      cultural_heritage_id: "1",
      lat: 35.205244,
      lng: 126.810495,
      address: " 광주광역시 광산구 오선동 549-1번지",
    },
    {
      cultural_heritage_id: "2",
      lat: 35.20508,
      lng: 126.810211,
      address: " 광주광역시 광산구 오선동 549-1번지",
    },
    {
      cultural_heritage_id: "3",
      lat: 35.205309,
      lng: 126.807715,
      address: " 광주광역시 광산구 오선동 271번지",
    },
    {
      cultural_heritage_id: "4",
      lat: 35.197128,
      lng: 126.803582,
      address: " 광주광역시 광산구 장덕동 971-3",
    },
    {
      cultural_heritage_id: "5",
      lat: 35.199092,
      lng: 126.814761,
      address: " 광주광역시 광산구 수완동 풍영로 313",
    },
  ];

  // 문화재 요청
  const [api, setApi] = useState();

  useEffect(() => {
    getAPI();
  }, []);

  const getAPI = async () => {
    try {
      // res에는 결과 값이 담겨옴
      const res = await axios.get("v1/culturalheritage/list", {
        lat: `${center.lat}`,
        lng: `${center.lng}`,
      });
      setApi(res ? [...res.data.data_body, ...places] : [...places]);
    } catch (e) {
      console.log(e.response);
    }
  };

  /* {no, asno, name_kr, name_hanja, content, sido_name, gugun_name,
             division, lng, lat, image_source, image_detail, narration, video_source} */

  const circleRangeOptions = {
    strokeColor: "#FF7575",
    strokeOpacity: 0,
    strokeWeight: 0,
    fillColor: "#C779D0",
    fillOpacity: 0.35,
    radius: 80,
    center,
  };

  const markerCircleOptions = {
    strokeColor: "#FFFFFF",
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: "#C779D0",
    fillOpacity: 0.5,
    radius: 10,
    center,
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ position: "relative" }}>
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
            // maxZoom: 17,
          }}
          mapContainerStyle={{ width: "100%", height: "100vh" }}
        >
          {/* 중심 레이더 옵션 */}
          <Circle center={center} options={circleRangeOptions} />
          <Circle center={center} options={markerCircleOptions} />

          {/* 문화재 마커 */}
          <MarkerClustererF options={{}}>
            {(clusterer) => (
              <>
                {api &&
                  api.map((place) => (
                    <MarkerF
                      key={place.no}
                      position={{
                        lat: Number(place.lat),
                        lng: Number(place.lng),
                      }}
                      onClick={() => {
                        goGetCard(place);
                      }}

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
            <InfoTop center={center}></InfoTop>
            {/* <div>{head && head }방향정보~</div>S */}
          </Body>

          <Body>
            <Testt>
              <ToggleButton
                onClick={() => setShowSemiCircle(!showSemiCircle)}
              />
              <SemiCircle show={showSemiCircle}>
                <div>
                  <SemiCircleButton>
                    <GiHandBag onClick={goCard} size={35} />
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

  /* background-image: url('https://w7.pngwing.com/pngs/952/332/png-transparent-ball-pocket-monster-poke-safari-poke-ball-set-icon.png'); */
  /* background-image: ; */
  background-image: url(${mapBtn});
  background-size: cover; // 이미지를 버튼 크기에 맞게 조절
  background-repeat: no-repeat; // 이미지를 반복하지 않음
  border: none;
`;

const SemiCircle = styled.div`
  position: relative;
  bottom: -100px;
  transform: translateX(-50%)
    ${(props) => (props.show ? "translateY(0)" : "translateY(100%)")};
  width: 500px;
  height: 350px;
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
  background-color: #f0f4ef; // 배경색 설정
  border-radius: 50%; // 원 모양 만들기
  border: 2px solid #72a16f; // 기본 테두리 제거
`;

const Testt = styled.div`
  position: fixed;
  bottom: 0px;
  left: 50%;
`;
