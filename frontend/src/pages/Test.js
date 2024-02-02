import React, { useEffect, useMemo, useState, useCallback } from "react";
import { GoogleMap, Circle, useJsApiLoader, MarkerF, MarkerClustererF } from "@react-google-maps/api";
import styled from "styled-components";
import InfoTop from "../components/Mains/InfoTop";
import { Sample1 } from "../components/Mains/MapStyles"

import * as THREE from 'three';

const google = window.google = window.google ? window.google : {}




export default function Maps () {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 35.175595, lng: 126.907032 });
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  const videoRef = React.useRef(null);
  const [playing, setPlaying] = React.useState(false);


  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAfcce2IjhzDkYHn7rZBilMDHw4f1c4IwU"
  });


  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) { 
      navigator.geolocation.watchPosition(function(position) {
        const latNow = position.coords.latitude;
        const lngNow = position.coords.longitude;
        console.log(latNow, lngNow);
        setCenter({lat: latNow, lng: lngNow});
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

  const places = [
    ['1', 35.202018, 126.811782],
    ['2', 35.201121, 126.807993],
    ['3', 35.203164, 126.813467]
  ]

  // const places = [
  //   [ key = '1',
  //     lat = 35.202018, 
  //     lng = 126.811782],
  //   [ key = '2',
  //     lat = 35.201121,
  //     lng = 126.807993],
  //   [ key = '3',
  //     lat = 35.203164, 126.813467]
  // ]


  // 카메라 전환

  // React.useEffect(() => {
  //   getWebcam((stream => {
  //     // setPlaying(false);
  //     videoRef.current.srcObject = stream;
  //   }));
  // }, []);


  // const getWebcam = (callback) => {
  //   try {
  //     const constraints = {
  //       'video': true,
  //       'audio': false
  //     }
  //     navigator.mediaDevices.getUserMedia(constraints)
  //       .then((mediaStream) => {
  //         const video = document.querySelector("video");
  //         video.srcObject = mediaStream;
  //         video.onloadedmetadata = () => {
  //           video.play();
  //         };
  //       });
  //   } catch (err) {
  //     console.log(err);
  //     return undefined;
  //   }
  // }


  // const startOrStop = () => {
  //   if (playing) {
  //     const s = videoRef.current.srcObject;
  //     s.getTracks().forEach((track) => {
  //       track.stop();
  //     });
  //   } else {
  //     getWebcam((stream => {
  //       setPlaying(true);
  //       videoRef.current.srcObject = stream;
  //     }));
  //   }
  //   setPlaying(!playing);
  // }


  // const cameraStyles = {
  //   Video: { width: "100%", height: "100%", background: 'rgba(245, 240, 215, 0.5)' },
  //   None: { display: 'none' },
  // }

  class Cs03 {
    constructor() {
        // 씬, 카메라, 렌더러 초기화
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // 비디오와 비디오 스트림 변수 초기화
        this.video = document.createElement('video');
        this.videoStream = null; // 초기에는 비디오 스트림을 null로 설정

        // 카메라 초기 위치 설정
        this.camera.position.z = 7;

        // 비디오 텍스처 및 재질, 지오메트리 생성 및 메시에 적용
        this.videoTexture = new THREE.VideoTexture(this.video);
        const videoMaterial = new THREE.MeshBasicMaterial({ map: this.videoTexture });
        const videoGeometry = new THREE.PlaneGeometry(16, 9);
        this.videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
        this.scene.add(this.videoMesh);

        // 애니메이션 함수 정의
        const animate = () => {
            // 비디오 데이터가 충분히 확보되면 텍스처 업데이트
            if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
                this.videoTexture.needsUpdate = true;
            }

            // 렌더링 및 다음 프레임 요청
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(animate);
        };

        // 애니메이션 시작
        animate();
    }

    // 웹캠 시작 함수
    startVideo() {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            this.video.srcObject = stream;
            this.video.play();

            // 이전 웹캠 스트림 중지
            this.stopVideo();

            // 비디오 스트림 저장
            this.videoStream = stream;
        }).catch((error) => {
            console.error('Error accessing webcam:', error);
        });
    }

    // 웹캠 정지 함수
    stopVideo() {
        // 이전 웹캠 스트림 중지
        if (this.videoStream) {
            const tracks = this.videoStream.getTracks();
            tracks.forEach(track => track.stop());
        }
    }

    // 프론트/백 카메라 전환 함수
    switchCamera() {
        // 카메라 전환 로직 추가
        console.log('Switching camera...');
      }
  }

  // Three.js 및 XR 활성화 코드
  const cs03Instance = new Cs03();

  // 웹캠 시작 버튼 클릭 이벤트
  document.getElementById('btn-front').addEventListener('click', () => {
      cs03Instance.startVideo();
  });

  // 후면 카메라 버튼 클릭 이벤트
  document.getElementById('btn-back').addEventListener('click', () => {
      cs03Instance.stopVideo();
      cs03Instance.switchCamera();
  });

  // 창 크기 변경 이벤트 리스너
  window.addEventListener('resize', () => {
      cs03Instance.camera.aspect = window.innerWidth / window.innerHeight;
      cs03Instance.camera.updateProjectionMatrix();
      cs03Instance.renderer.setSize(window.innerWidth, window.innerHeight);
  });




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
            minZoom: 16, 
            maxZoom: 18,
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
                {places.map((place) => (
                  <MarkerF 
                    key={place[0]}
                    position={{lat: place[1], lng: place[2]}}
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
            <InfoTop ></InfoTop>
          </Body>

        </GoogleMap>
      </div>
    </div>
  )
}

const Body = styled.div`
  width: 100%;
  position: absolute;
  z-index: 10;
`;
