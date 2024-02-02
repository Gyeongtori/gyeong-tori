import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import Toggle from './Toggle';

import { IoSettingsOutline } from "react-icons/io5";
import { GiHandBag } from "react-icons/gi";
import { FaTrophy } from "react-icons/fa";
import axios from 'axios';

const InfoTop = (props) => {
  const navigate = useNavigate()

  // 내 위치
  const [center, setCenter] = useState({ lat: props.center.lat, lng: props.center.lng});
  // console.log('center: ', center.lat);


  // 초기 온도 상태 설정
  const [temp, setTemp] = useState(null)
  const [icon, setIcon] = useState(null)

  // Toggle option
  const [isOn, setIsOn] = useState(false);
  
  // 좌표 -> 주소 변환
  const [adressNow, setAdressNow] = useState()
  

  useEffect(()=>{
    getWeatherByCurrentLocation()

  }, [])


  // 위도 경도 -> 주소
  // const getAdress = async () => {
  //   try {
  //     let url = "https://api.vworld.kr/req/address?service=address&request=getAddress&version=2.0&crs=epsg:4326&point=129.210748,35.831490&type=both&zipcode=true&simple=false&key=1307BDF2-20BB-3FB6-B098-6C8FF3D01BE2"

  //     let response = await fetch(url, {
  //       method: 'GET',
  //       mode: 'no-cors'
  //     })
  //     let data = await response.json();
  //     console.log('data: ', data);
  //   } catch (e) {
  //     console.log(e.response);
  //   }
  // };


  const [address, setAddress] = useState();	

  useEffect((props) => {
    getAddress();
  }, []);
    
  const getAddress = async () => {
    try {
      // res에는 결과 값이 담겨옴
      const res = await axios.get(`https://api.vworld.kr/req/address?service=address&request=getAddress&version=2.0&crs=epsg:4326&point=${center.lng},${center.lat}&type=both&zipcode=true&simple=false&key=1307BDF2-20BB-3FB6-B098-6C8FF3D01BE2`, 
      // {headers: {
      //   'Access-Control-Allow-Origin' : 'http://localhost:3000/maps'
      // }}
      );
      setAddress(res.data.response.result[0])
      // console.log(address.structure.level4L, '00동')

    } catch (e) {
      console.log(e.response);
    }
  };


// 현재 날씨 받아오기
  const getWeatherByCurrentLocation= async ()=>{
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${center.lat}&lon=${center.lng}&appid=101694a50d5922c2274bdd9982d0eacd&units=metric`
    let response = await fetch(url)
    let data = await response.json();
    // console.log(data, '이게 될까?');

    // 온도 정보 업데이트
    setTemp(data.main.temp)
    setIcon(data.weather[0].icon)

  }

  const goProfile = () => {
    navigate("/profile")
  }

  const goCard = () => {
    navigate("/cards")
  }


  return (
    <div>
      <Info>
        <InfoHeader>
          <img src={`https://openweathermap.com/img/w/${icon}.png`} alt="" />
          <div>{ temp }°C</div>
          <div>{ address && address.structure.level4L }</div> 
        </InfoHeader>

        <InfoHeaderRight>
          < Toggle setIsOn={setIsOn} />
          <IoSettingsOutline 
          size={25} 
          onClick={goProfile}
          
          />
        </InfoHeaderRight>
      </Info>

      <InfoSide>
        <GiHandBag onClick={goCard} size={25} />
        
        {isOn && <FaTrophy size={25} />}
      </InfoSide>

    </div>
  )
}

export default InfoTop

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
  align-items: center; /* 세로 중앙 정렬 */
`

const InfoHeader = styled.div`
  
`


const InfoHeaderRight = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;

  & > :first-child {
    margin-right: 10px;
  }

`

const InfoSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 10px;

  & > :first-child {
    margin-bottom: 10px;
  }
`

