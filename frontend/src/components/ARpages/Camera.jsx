import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import * as THREE from "three";

import html2canvas from "html2canvas";
import Capture from "./capturePage";

export default function Camera(props) {
  const { state } = useLocation();
  console.log(state, "이거는 상속받아온 값입니다.");

  const [isModalOpen, setIsModalOpen] = useState(false);
 
  // const navigate = useNavigate();
  // const

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
        console.log(imageDataURL);
        setCapturedImageDataURL(imageDataURL);
        stopVideo();
        setIsModalOpen(!isModalOpen);
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
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const canvas = document.querySelector("#canvas");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // useRef를 사용하여 렌더러, 씬 및 카메라에 대한 참조 설정
    rendererRef.current = renderer;
    // document.body.appendChild(renderer.domElement);
    sceneRef.current = scene;
    cameraRef.current = camera;

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
            const videoGeometry = new THREE.PlaneGeometry(6, 12);
            const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
            scene.add(videoMesh);
            videoMeshRef.current = videoMesh;
            camera.position.y = 1
            camera.position.z = 7;
            videoStreamRef.current = stream;

            const animate = () => {
              if (video.readyState === video.HAVE_ENOUGH_DATA) {
                videoTexture.needsUpdate = true;
              }

              renderer.render(scene, camera);
              requestAnimationFrame(animate);
            };

            animate();
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
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        
        window.innerWidth * devicePixelRatio,
        window.innerHeight * devicePixelRatio
      );
  
    };

    // 창 크기 조절 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);

    // useEffect의 cleanup 함수
    return () => {
      // 이벤트 리스너 제거
      window.removeEventListener("resize", handleResize);
      // 비디오 스트림 정리
      const { current: videoStream } = videoStreamRef;
      if (videoStream) {
        const tracks = videoStream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [facingMode]); // facingMode 변수가 변경될 때마다 useEffect가 다시 실행됨
  // 요기까지 유즈 이펙트

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
              width: "100%",
              // maxWidth: "100vw",
              height: "100%",
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
      )}
    </div>
  );
}
