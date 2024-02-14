import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Toggle from "./Toggle";

import { IoSettingsOutline } from "react-icons/io5";
import { FaTrophy } from "react-icons/fa";
import axios from "axios";

const InfoTop = (props) => {
  // 내 위치
  const [center, setCenter] = useState({
    lat: props.center.lat,
    lng: props.center.lng,
  });
  // console.log(center, 'info 센터값입니다')

  // 초기 온도 상태 설정
  const [temp, setTemp] = useState(null);
  const [icon, setIcon] = useState(null);

  // Toggle option
  const [isOn, setIsOn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getWeatherByCurrentLocation();
  }, []);

  const [address, setAddress] = useState();

  // useEffect((props) => {
  //   getAddress();
  // }, []);

  // const getAddress = async () => {
  //   try {
  //     // res에는 결과 값이 담겨옴

  //     const res = await axios.get(`https://api.vworld.kr/req/address?service=address&request=getAddress&version=2.0&crs=epsg:4326&point=${center.lng},${center.lat}&type=both&zipcode=true&simple=false&key=${process..env.REACT_APP_SIDO_KEY}`,
  //     // const res = await axios.get(`${process..env.REACT_APP_SIDO_API_URL}${center.lng},${center.lat}${process..env.REACT_APP_SIDO_KEY}`
  //     // https://api.vworld.kr/req/address?service=address&request=getCoord&key=&type=both&zipcode=true&simple=false&key=1307BDF2-20BB-3FB6-B098-6C8FF3D01BE2127.766922,35.907757
  //     // {headers: {
  //     //   'Access-Control-Allow-Origin' : 'http://localhost:3000/maps'
  //     // }}
  //     );
  //     setAddress(res.data.response.result[0])
  //     // console.log(address.structure.level4L, '00동')
  //   } catch (e) {
  //     console.log(e.response);
  //   }
  // };

  // console.log('주소위치 찍기',`${process..env.REACT_APP_SIDO_API_URL}${process..env.REACT_APP_SIDO_KEY}${center.lng},${center.lat}`)

  // 현재 날씨 받아오기
  const getWeatherByCurrentLocation = async () => {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${center.lat}&lon=${center.lng}&appid=101694a50d5922c2274bdd9982d0eacd&units=metric`;
    let response = await fetch(url);
    let data = await response.json();
    // console.log(data.main.temp, '?????');

    // 온도 정보 업데이트
    setTemp(Math.floor(data.main.temp));
    setIcon(data.weather[0].icon);
  };



  return (
    <div>
      <Info>
        <InfoHeader>
          <WeatherContainer>
            <WeatherBlock>
              <img
                src={`https://openweathermap.com/img/w/${icon}.png`}
                alt=""
              />
            </WeatherBlock>
            <WeatherInfo>
              <div>{address && address.structure.level4L}</div>
              <div>{temp}°C</div>
            </WeatherInfo>
          </WeatherContainer>
        </InfoHeader>

        <InfoHeaderRight>
          {/* <Toggle setIsOn={setIsOn} /> */}
        </InfoHeaderRight>
      </Info>

    </div>
  );
};

export default InfoTop;

/* <ToggleSwitch
  checked={isActive} // isToggleOn 상태를 확인하여 토글 상태를 설정
  onChange={() => setIsActive(!isActive)} // 토글 버튼 클릭 시 상태 변경
  onColor="#ED6A2C" // 토글 활성화 배경색
  offColor="#A1A1A1"   // 토글 비활성화 배경색
  handleDiameter={22} // 핸들 지름 설정
  activeBoxShadow="0 0 2px 3px #ED6A2C" // 토글 활성화 박스 쉐도우
  boxShadow="0 0 2px 3px #A1A1A1" // 토글 비활성화 박스 쉐도우
  className="custom-switch" // 커스텀 클래스 추가
/> */

const Info = styled.div`
  /* background-color: wheat; */

  display: flex;
  justify-content: space-between;
  align-items: center; 
`;

const InfoHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoHeaderRight = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;

  & > :first-child {
    margin-right: 10px;
  }
`;

const WeatherContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WeatherBlock = styled.div`
  background-color: white;
  margin: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  border: 5px solid rgb(114, 161, 111, 0.5);
`;

const WeatherInfo = styled.div`
  margin-top: -40px;
  color: black;
  font-size: 15px;
`;
