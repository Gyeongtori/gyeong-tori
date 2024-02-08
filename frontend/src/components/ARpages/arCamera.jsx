import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from "three";
import html2canvas from "html2canvas";
import Capture from "./capturePage";

export default function Camera(props) {
  const { state } = useLocation();
  console.log(state, "이거는 상속받아온 값입니다.");

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const videoTextureRef = useRef(null);
  const videoMeshRef = useRef(null);
  const videoStreamRef = useRef(null);
  const canvasRef = useRef(null);

  const [capturedImageDataURL, setCapturedImageDataURL] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [captureState, setCaptureState] = useState(false);

  const stopVideo = () => {
    // stopVideo 함수를 handelCapture 함수 밖에 정의
    const { current: videoStream } = videoStreamRef;
    if (videoStream) {
      const tracks = videoStream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    // 비디오 스트림이 중지되면 모달 창을 닫음
    // setIsModalOpen(false);
  };

  const handelCapture = (e) => {
    const canvas = canvasRef.current;
    html2canvas(canvas)
      .then((canvas) => {
        const imageDataURL = canvas.toDataURL();
        console.log(imageDataURL,imageDataURL);
        setCapturedImageDataURL(imageDataURL);
        stopVideo();
        // setIsModalOpen(!isModalOpen);
        setCaptureState(true);
      })
      .catch((error) => {
        console.error("Error capturing canvas:", error);
      });
  };

  function toggleFacingMode() {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  }
  // 여기부터
  useEffect(() => {
    // 새로운 THREE.js 씬, 카메라 및 렌더러 생성
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    camera.position.set(0,0,10)
    const canvas = document.querySelector("#canvas");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      preserveDrawingBuffer: true,
      antialias:true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // useRef를 사용하여 렌더러, 씬 및 카메라에 대한 참조 설정
    rendererRef.current = renderer;
    // document.body.appendChild(renderer.domElement);
    sceneRef.current = scene;
    cameraRef.current = camera;

    
    // 빛 설정
    const ambientLight = new THREE.AmbientLight(0xffffff, 3); // 주변 조명
    const directionalLight = new THREE.DirectionalLight(0xff0000, 1); // 방향 조명
    directionalLight.position.set(1, 1, 1).normalize(); // 조명의 위치
    // 씬에 빛 추가
    scene.add(ambientLight);
    scene.add(directionalLight);
    //gltf instense 생성 및 로드
    
    const loadGltfModel = () => {
      // GLTF 모델 로드
      let loader = new GLTFLoader();
  
      loader.load("metarial/1234.gltf", (gltf) => {
          console.log('GLTF 모델이 성공적으로 로드되었습니다.', gltf);
  
          if (gltf.scene) {
              // 씬에 로드된 객체들 추가
              gltf.scene.traverse((object) => {
                  // traverse 함수 내에서 호출되는 콜백 함수를 이용하여 객체들을 씬에 추가합니다.
                  sceneRef.current.add(object);
              });
  
              // 애니메이션 시작
              animate();
          } else {
              console.error('GLTF 모델의 씬이 정의되지 않았습니다.');
          }
      }, undefined, (error) => {
          console.error('GLTF 모델 로딩 중 오류:', error);
      });
  }

  const animate = () => {
    // 비디오 텍스처 갱신
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        videoMeshRef.current.material.map.needsUpdate = true;
    }

    // 렌더링 및 애니메이션 재귀 호출
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    requestAnimationFrame(() => animate(video));
}

    let video;

    // 비디오 시작 함수
    const startVideo = () => {
      try {
        const constraints = {
          video: { facingMode },
          audio: false,
        };
        
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            video = document.createElement("video");
            video.srcObject = stream;
            video.play();

            const videoTexture = new THREE.VideoTexture(video);
            videoTextureRef.current = videoTexture;
            const videoMaterial = new THREE.MeshBasicMaterial({
              map: videoTexture,
            });
            const videoGeometry = new THREE.PlaneGeometry(16, 12);
            const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
            scene.add(videoMesh);
            videoMeshRef.current = videoMesh;
            camera.position.y = 1
            camera.position.z = 7;
            videoStreamRef.current = stream;
            loadGltfModel()
            const animate = () => {
              if (video.readyState === video.HAVE_ENOUGH_DATA) {
                videoTexture.needsUpdate = true;
              }

              renderer.render(scene, camera);
              requestAnimationFrame(animate);
            };

            animate(video);
          })
          .catch((error) => {
            console.error("Error accessing webcam:", error);
          });
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    // 비디오 시작 함수 호출
    startVideo();

    // 창 크기 조절 이벤트 핸들러
    const resizeCanvas = () => {
      const canvas = rendererRef.current.domElement;
  const { current: camera } = cameraRef;

  // Canvas의 크기를 창의 크기와 동일하게 설정
  canvas.width = window.innerWidth * devicePixelRatio;
  if (window.innerWidth <= 600) {
    canvas.height = 300 * devicePixelRatio; // 600px 이하의 화면 높이
  } else if (window.innerWidth <= 1024) {
    canvas.height = 400 * devicePixelRatio; // 601px에서 1024px 사이의 화면 높이
  } else {
    canvas.height = 600 * devicePixelRatio; // 1025px 이상의 화면 높이
  }
  // Three.js의 렌더러 크기도 업데이트
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
    };

    

    // 창 크기 조절 이벤트 리스너 등록
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas()
    // useEffect의 cleanup 함수
    return () => {
      // 이벤트 리스너 제거
      window.removeEventListener("resize", resizeCanvas);
      // 비디오 스트림 정리
      const { current: videoStream } = videoStreamRef;
      if (videoStream) {
        const tracks = videoStream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [facingMode]); // facingMode 변수가 변경될 때마다 useEffect가 다시 실행됨
  // 요기까지 유즈 이펙트

  useEffect(() => {
    // facingMode가 environment인 경우 scaleX(1)로 설정
    if (facingMode === "environment") {
      const canvas = canvasRef.current;
      canvas.style.transform = "scaleX(1)";
    }
  }, [facingMode]);

  return (
    <div>
      {captureState === true ? (
        captureState && (
          <Capture
            url={capturedImageDataURL}
            state={state}
            captureState={captureState}
            setCaptureState={setCaptureState}
          />
        )
      ) : (
        <div>
          <canvas
          
            ref={canvasRef}
            id="canvas"
            style={{
              width: "600px",
              // maxWidth: "100vw",
              height: "768px",
              transform: "scaleX(-1)",
            }}
          ></canvas>
          <div>
            <button color="primary" onClick={toggleFacingMode}>
              카메라 전환하기
            </button>
            <button onClick={handelCapture}>캡쳐하기</button>
          </div>
        </div>
      ) }
      
    </div>
  );
}
