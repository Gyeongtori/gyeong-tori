import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from "three";
import html2canvas from "html2canvas";
import Capture from "./capturePage";

export default function Camera(props) {
  const { state } = useLocation();
  const navigate = useNavigate();
  console.log(state, "이거는 상속받아온 값입니다.");

  const rendererRef = useRef(null);
  const videoSceneRef = useRef(new THREE.Scene()); // 비디오 씬
  const modelSceneRef = useRef(new THREE.Scene()); // 모델 씬
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));

  const videoTextureRef = useRef(null);
  const videoMeshRef = useRef(null);
  const videoStreamRef = useRef(null);
  const canvasRef = useRef(null);

  const [capturedImageDataURL, setCapturedImageDataURL] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [captureState, setCaptureState] = useState(false);

  const backMap = () => {
    navigate("/maps");
  };

  const stopVideo = () => {
    const { current: videoStream } = videoStreamRef;
    if (videoStream) {
      const tracks = videoStream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const handelCapture = (e) => {
    const canvas = canvasRef.current;
    html2canvas(canvas)
      .then((canvas) => {
        const imageDataURL = canvas.toDataURL();
        setCapturedImageDataURL(imageDataURL);
        stopVideo();
        setCaptureState(true);
      })
      .catch((error) => {
        console.error("Error capturing canvas:", error);
      });
  };

  function toggleFacingMode() {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  }

  useEffect(() => {
    // 비디오 입력 장치 목록 확인
    navigator.mediaDevices.enumerateDevices()
      .then(function(devices) {
        devices.forEach(function(device) {
          if(device.kind === 'videoinput') {
            console.log(device.label);
            console.log(device.deviceId);
          }
        });
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      });

    // 원하는 카메라의 ID를 입력하세요.
    const desiredCameraId = "여기에 원하는 카메라의 ID를 입력하세요";

    // 선택한 카메라로 사용자 미디어 스트림 얻기
    navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: desiredCameraId }
      }
    })
    .then((stream) => {
      // 비디오 스트림을 이용하여 작업 수행
      // 이 부분은 비디오 스트림을 처리하는 로직입니다.
    })
    .catch((error) => {
      console.error("Error accessing webcam:", error);
    });
  }, []);

  // return 구문과 이후의 코드도 이전과 동일하게 작성합니다.
  
  // return 구문과 이후의 코드도 이전과 동일하게 작성합니다.
}
