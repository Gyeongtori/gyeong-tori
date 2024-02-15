import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from "three";
import styled from "styled-components";
import html2canvas from "html2canvas";
import Capture from "./capturePage";
import './camera.css'

export default function Camera(props) {
  const { state } = useLocation();
  const navigate = useNavigate();

  const rendererRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const videoSceneRef = useRef(new THREE.Scene());
  const modelSceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(
      100
      ,
      window.innerWidth / window.innerHeight,
      1,
      10000
    )
  );

  const videoTextureRef = useRef(null);
  const videoStreamRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImageDataURL, setCapturedImageDataURL] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [captureState, setCaptureState] = useState(false);
  const controls = useRef(null);
  const gltfModelRef = useRef(null); // 모델을 참조할 변수 추가

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
    const scene = sceneRef.current;
    const camera = cameraRef.current;
  
    camera.position.set(0, 0, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    const canvas = document.querySelector("#canvas");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      preserveDrawingBuffer: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    const directionalLight = new THREE.DirectionalLight(0xff0000, 3);
    directionalLight.position.copy(camera.position);
    directionalLight.position.set(0, 10, 10);
    directionalLight.target.position.set(0, 1, 1);

    scene.add(ambientLight);
    scene.add(directionalLight);

    modelSceneRef.current.add(ambientLight);
    modelSceneRef.current.add(directionalLight);

    const loadGltfModel = (scene) => {
      let loader = new GLTFLoader();
      loader.load(
        "metarial/1234.gltf",
        (gltf) => {
          const model = gltf.scene;
          model.position.set(-3, -7, -5);
          gltfModelRef.current = model; // 모델을 gltfModelRef에 저장
          model.traverse((child) => {
            if (child.isMesh) {
              if (child.material.map) {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0xffffff,
                  map: child.material.map,
                  roughness: 0.5,
                  metalness: 0.5,
                  depthTest: true,
                  transparent: false,
                });
              }
            }
          });

          scene.add(model);
          controls.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
          controls.current.enableDamping = true;
          controls.current.dampingFactor = 0.25; 
          controls.current.rotateSpeed = 0.35; 
          controls.current.screenSpacePanning = false; 
          controls.current.maxPolarAngle = Math.PI / 2; 
        
        },
        undefined,
        (error) => {
          console.error("An error happened:", error);
        }
      );
    };

    const animate = () => {
      requestAnimationFrame(animate);

      moveModelToPhonePosition();
      renderer.autoClear = false;
      renderer.clear();
      renderer.render(videoSceneRef.current, cameraRef.current);
      renderer.clearDepth();
      renderer.render(modelSceneRef.current, cameraRef.current);
      if (controls.current) {
        controls.current.update();
      }
    };

    let video;

    const startVideo = () => {
      try {
        const constraints = {
          video: { 
            facingMode:facingMode,
            frameRate:{max:60},
           },
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
              depthTest: true,
              transparent: true,
            });

            const videoGeometry = new THREE.PlaneGeometry(9, 20);
            const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
            videoMesh.renderOrder = 0;

            videoSceneRef.current.add(videoMesh);

            camera.position.z = 7.5;
            videoStreamRef.current = stream;

            loadGltfModel(modelSceneRef.current);
            animate();
          })
          .catch((error) => {
            console.error("Error accessing webcam:", error);
            constraints.video.facingMode = "environment";
          });
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    // startVideo();

    const resizeCanvas = () => {
      const canvas = rendererRef.current.domElement;
      canvas.width = window.innerWidth;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      stopVideo();
      startVideo();
    };
  }, [facingMode]);
  

  useEffect(() => {
    const canvas = canvasRef.current;
    if (facingMode === "environment") {
      canvas.style.transform = "scaleX(1)";
    } else if (facingMode === "user") {
      canvas.style.transform = "scaleX(-1)";
    }
  }, [facingMode]);

  useEffect(() => {
    // 핸드폰의 가속도계와 자이로스코프를 사용하여 핸드폰의 움직임을 감지합니다.
    window.addEventListener('deviceorientation', handleOrientation);

    // 이벤트 리스너를 제거합니다.
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const [phoneOrientation, setPhoneOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });

  function handleOrientation(event) {
    console.log("Orientation event received:", event);
    setPhoneOrientation({
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma
    });
  }
  


  function calculatePositionFromOrientation(orientation) {
    // orientation 값을 라디안으로 변환하여 사용
    const alphaRad = orientation.alpha * Math.PI / 180;
    const betaRad = orientation.beta * Math.PI / 180;
    const gammaRad = orientation.gamma * Math.PI / 180;

    // 각도를 벡터로 변환하여 반환
    return new THREE.Vector3(alphaRad, betaRad, gammaRad);
  }

  function moveModelToPhonePosition() {
    if (!gltfModelRef.current) return; // .current를 사용하여 현재 참조하는 요소를 가져옴

    const phonePosition = calculatePositionFromOrientation(phoneOrientation);
    gltfModelRef.current.position.copy(phonePosition);
  }


  return (
    <div>

      {captureState === true ? (
        captureState && (
          <Capture
          url={capturedImageDataURL}
          state={state}
          address={state.address}
          cultural_heritage_id={state.no}
          captureState={captureState}
          setCaptureState={setCaptureState}
          />
        )
      ) : (
        <div>
          <BodyMake>
          <canvas ref={canvasRef} id="canvas" style={{ width: "100%", height: "100%"}} ></canvas>
          </BodyMake>
          <div>
            {/* <button color="primary" onClick={toggleFacingMode}>
              카메라 전환하기
            </button> */}
            <button onClick={handelCapture}>캡쳐하기</button>
            <button style={{ marginBottom: "10px" }} onClick={backMap}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
const BodyMake = styled.div`
  width: 100%;
  height: 90vh;
  overflow: auto;
`;
