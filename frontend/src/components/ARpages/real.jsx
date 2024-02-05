import React,{ useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';




const getWebcam = (callback) => {
  try {
    const constraints = {
      'video': { facingMode:'user'},
      'audio': false
    }
    navigator.mediaDevices.getUserMedia(constraints)
      .then(callback);
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

const Styles = {
  Video: { width: "100%", height: "100%" },
  None: { display: 'none' },
}

function Camera() {
  const [playing, setPlaying] = React.useState(undefined);
  const location = useLocation();
  const key = location.state.no

    const videoRef = React.useRef(null);
  
    React.useEffect(() => {
      getWebcam((stream => {
        setPlaying(true);
        videoRef.current.srcObject = stream;
      }));
    }, []);
  
    const startOrStop = () => {
      if (playing) {
        const s = videoRef.current.srcObject;
        s.getTracks().forEach((track) => {
          track.stop();
        });
      } else {
        getWebcam((stream => {
          setPlaying(true);
          videoRef.current.srcObject = stream;
        }));
      }
      setPlaying(!playing);
    }
  
    return (<>
        <video ref={videoRef} autoPlay style={ {transform: 'scaleX(-1)'}} />
        <button color="warning" onClick={() => startOrStop()}>{playing ? 'Stop' : 'Start'} </button>
    </>);
};

export default Camera;

const toggleFacingMode = () =>{
    setFacingMode(prevFacingMode => (prevFacingMode === 'user' ? 'environment' : 'user'));
  };



  // THREE 라이브러리에서 필요한 모듈을 가져오기
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 씬, 카메라, 렌더러 초기화
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 비디오와 비디오 스트림 변수 초기화
let video;
let videoStream;

// 웹캠 비디오 스트림을 가져와서 텍스처로 적용하는 코드
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    // 비디오 엘리먼트 생성 및 웹캠 스트림 적용
    video = document.createElement('video');
    video.srcObject = stream;
    video.play();

    // 비디오 텍스처 및 재질, 지오메트리 생성 및 메시에 적용
    const videoTexture = new THREE.VideoTexture(video);
    const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
    const videoGeometry = new THREE.PlaneGeometry(16, 9);
    const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
    scene.add(videoMesh);

    // GLTF 모델 로드 및 씬에 추가
    let loader = new GLTFLoader();
    loader.load("../static/img/hmm/file.gltf", function (gltf) {
        scene.add(gltf.scene);
        animate();
    }, undefined, function (error) {
        console.error('Error loading GLTF model:', error);
    });

    // 카메라 초기 위치 설정
    camera.position.z = 3;

    // 비디오 스트림 저장
    videoStream = stream;

    // 애니메이션 함수 정의
    const animate = () => {
        // 비디오 데이터가 충분히 확보되면 텍스처 업데이트
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            videoTexture.needsUpdate = true;
        }

        // 렌더링 및 다음 프레임 요청
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    // 애니메이션 시작
    animate();
}).catch((error) => {
    console.error('Error accessing webcam:', error);
});

// 창 크기 변경 이벤트 리스너
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 웹캠 켜기/끄기 함수 정의
const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
        video.play();

        // 비디오 텍스처 갱신
        const videoTexture = new THREE.VideoTexture(video);
        scene.getObjectByName('videoMesh').material.map = videoTexture;

        // 비디오 스트림 저장
        videoStream = stream;
    }).catch((error) => {
        console.error('Error accessing webcam:', error);
    });
};

const stopVideo = () => {
    // 현재 웹캠 스트림 중지
    if (videoStream) {
        const tracks = videoStream.getTracks();
        tracks.forEach(track => track.stop());
    }
};

// 프론트/백 카메라 전환 이벤트 리스너
document.getElementById('btn-front').addEventListener('click', () => {
    stopVideo();
    startVideo();
});

document.getElementById('btn-back').addEventListener('click', () => {
    stopVideo();
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then((stream) => {
        video.srcObject = stream;
        video.play();

        // 비디오 텍스처 갱신
        const videoTexture = new THREE.VideoTexture(video);
        scene.getObjectByName('videoMesh').material.map = videoTexture;

        // 비디오 스트림 저장
        videoStream = stream;
    }).catch((error) => {
        console.error('Error accessing webcam:', error);
    });
});
