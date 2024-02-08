import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from "three";
import html2canvas from "html2canvas";
import Capture from "./capturePage";
import { Model } from './Model'; // Model 컴포넌트를 import 합니다.

export default function Camera(props) {
  const { state } = useLocation();
  const navigate = useNavigate();
  console.log(state, "이거는 상속받아온 값입니다.");

  // 캔버스 관련 상태 및 레퍼런스
  const canvasRef = useRef(null);
  const [capturedImageDataURL, setCapturedImageDataURL] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [captureState, setCaptureState] = useState(false);

  // 캔버스 캡처 함수
  const handleCapture = () => {
    const canvas = canvasRef.current;
    html2canvas(canvas)
      .then((canvas) => {
        const imageDataURL = canvas.toDataURL();
        setCapturedImageDataURL(imageDataURL);
        // 캡처 완료 상태 업데이트
        setCaptureState(true);
      })
      .catch((error) => {
        console.error("Error capturing canvas:", error);
      });
  };

  // 카메라 전환 함수
  const toggleFacingMode = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  useEffect(() => {
    // 캔버스 크기 조정 함수
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      // 캔버스 크기 조정 로직 추가
    };

    // 창 크기 변경 이벤트 리스너 등록
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // 초기 캔버스 크기 설정

    // useEffect의 cleanup 함수
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []); // 컴포넌트가 처음 렌더링될 때만 실행

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
          {/* 캔버스 */}
          <canvas
            ref={canvasRef}
            id="canvas"
            style={{
              width: "600px",
              height: "768px",
              transform: "scaleX(-1)",
            }}
          ></canvas>

          {/* GLTF 모델 */}
          <Model />

          {/* 카메라 컨트롤 버튼 */}
          <div>
            <button color="primary" onClick={toggleFacingMode}>
              카메라 전환하기
            </button>
            <button onClick={handleCapture}>캡처하기</button>
            <button style={{ marginBottom: "10px" }} onClick={backMap}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
