import React, { useState, useEffect } from 'react'
import styled from "styled-components";

const Info = styled.div`
  display: felx
`

// Toggle
const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 47.7px;
  height: 23.33px;
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 15px;
    width: 15px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
  }
`;

const CheckBox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + ${ToggleSlider} {
    background-color: #ED6A2C;
  }

  &:focus + ${ToggleSlider} {
    box-shadow: 0 0 1px #2196F3;
  }

  &:checked + ${ToggleSlider}:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
`;




const InfoTop = () => {
  // 초기 온도 상태 설정
  const [temp, setTemp] = useState(null)
  const [icon, setIcon] = useState(null)

  const [isActive, setIsActive] = useState(false)

  const getCurrentLocation=()=>{
    navigator.geolocation.watchPosition((position)=>{
      let lat = position.coords.latitude
      let lon = position.coords.longitude
      console.log(lat, lon, '현재위치')
      getWeatherByCurrentLocation(lat, lon)

    })
  }

  useEffect(()=>{
    getCurrentLocation()

  }, [temp])


  const getWeatherByCurrentLocation= async (lat, lon)=>{
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=101694a50d5922c2274bdd9982d0eacd&units=metric`
    let response = await fetch(url)
    let data = await response.json();
    console.log(data);

    // 온도 정보 업데이트
    setTemp(data.main.temp)
    setIcon(data.weather[0].icon)

  }


  // 주소 바꾸기 XX
  // const alterAddress = (lat, lon) => {
  // const API_KEY = '84ce352790538c53c7ae183bc7b7d56f'
  // if (lat && lon) {
  //     axios.get(
  //         `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lat}&y=${lon}`,
  //         { headers: { Authorization: `KakaoAK ${API_KEY}`} }
  //     ).then((result) => {
  //       console.log(result, '주소!')
        
  //       //법정동 기준으로 동단위의 값을 가져온다
  //       // let location = result.documents[0].region_3depth_name;
  //     })
  //   }
  // }
  

  return (
    <div>
      <Info>

          <img src={`https://openweathermap.com/img/w/${icon}.png`} alt="" />
          <div>{ temp }</div>
          <div>00동</div>
          <ToggleSwitch>
            <CheckBox
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
            />
            <ToggleSlider />
          </ToggleSwitch>
        
      </Info>

    </div>
  )
}

export default InfoTop