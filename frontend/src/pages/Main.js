import React, { useState, useEffect } from 'react'
// import { WiDaySnowWind } from "react-icons/wi";

export const Main = () => {
  // 초기 온도 상태 설정
  const [temp, setTemp] = useState(null)
  const [icon, setIcon] = useState(null)

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

  },[])

  // useEffect(() => {
  //   // 위치 정보를 가져올 때 getWeatherByCurrentLocation 함수 호출
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     getWeatherByCurrentLocation(position.coords.latitude, position.coords.longitude);
  //   });
  // }, []);


  //api 가져오기
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
      <div>
        <img src={`https://openweathermap.com/img/w/${icon}.png`} alt="" />
        {/* <WiDaySnowWind size="40" /> */}
        <div>{ temp }</div>
        <div>인왕동</div>
      </div>

      <div>
        <i></i>
      </div>

      <div>
        <h2>카드 획득까지</h2>
        <h1>27M</h1>
      </div>
    </div>
  )
}

export default Main