import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from "three";
import html2canvas from "html2canvas";
import Capture from "./capturePage";

export default function Camera(props) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const cultural_heritage_id = state.no;

  
  console.log(state,state.cultural_heritage_id, state.address, "이거는 상속받아온 값입니다.");

  const rendererRef = useRef(null);
  const videoSceneRef = useRef(new THREE.Scene()); // 비디오 씬
  const modelSceneRef = useRef(new THREE.Scene()); // 모델 씬
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));

  const videoTextureRef = useRef(null);
  const videoMeshRef = useRef(null);
  const videoStreamRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImageDataURL, setCapturedImageDataURL] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
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
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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
    cameraRef.current = camera;

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    const directionalLight = new THREE.DirectionalLight(0xff0000, 3);
    directionalLight.position.copy(camera.position);
    directionalLight.position.set(0, 10, 10); 
    directionalLight.target.position.set(0,1,1);

    scene.add(ambientLight);
    scene.add(directionalLight);
    
    modelSceneRef.current.add(ambientLight);
    modelSceneRef.current.add(directionalLight);

    const loadGltfModel = (scene) => {
      let loader = new GLTFLoader();
      loader.load("metarial/1234.gltf", (gltf) => {
        const model = gltf.scene;
        model.position.set(-3, -14, -5);

        // 모델이 로드된 후에 재질에 조명을 추가합니다.
        model.traverse((child) => {
          if (child.isMesh) {
            // 텍스처가 이미 할당되어 있는지 확인
            if (child.material.map) {
              // 기존 머티리얼 속성을 유지하면서 새로운 머티리얼 생성
              child.material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                map: child.material.map,
                roughness: 0.5,
                metalness: 0.5,
                depthTest: true, // 깊이 테스트 사용
                transparent: false,
              });
            }
          }
        });

        // 모델 씬에 모델을 추가합니다.
        scene.add(model);
      }, undefined, (error) => {
        // 모델 로드 실패
        console.error('An error happened:', error);
      });
    };

    const animate = () => {
      requestAnimationFrame(animate);

      renderer.autoClear = false;
      renderer.clear();
      renderer.render(videoSceneRef.current, camera);
      renderer.clearDepth();
      renderer.render(modelSceneRef.current, camera);
    };

    let video;

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
              depthTest: true, // 깊이 테스트 사용
              transparent: true, // 깊이 정렬 및 투명도 설정
            });

            const videoGeometry = new THREE.PlaneGeometry(16, 12);
            const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
            videoMesh.renderOrder = 0; // 비디오 메시를 먼저 렌더링

            // 비디오 씬에 비디오 메시를 추가합니다.
            videoSceneRef.current.add(videoMesh);

            camera.position.z = 7.5;
            videoStreamRef.current = stream;

            // 모델 로드 함수 호출
            loadGltfModel(modelSceneRef.current);

            // 애니메이션 시작
            animate();
          })
          .catch((error) => {
            console.error("Error accessing webcam:", error);
          });
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    startVideo();

    const resizeCanvas = () => {
      const canvas = rendererRef.current.domElement;
      canvas.width = window.innerWidth * devicePixelRatio;
      if (window.innerWidth <= 600) {
        canvas.height = 300 * devicePixelRatio;
      } else if (window.innerWidth <= 1024) {
        canvas.height = 400 * devicePixelRatio;
      } else {
        canvas.height = 600 * devicePixelRatio;
      }
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas()

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      stopVideo();
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
  return (
    <div>
      {captureState === true ? (
        captureState && (
          <Capture
            url={capturedImageDataURL}
            state={state}
            address= {state.address}
            cultural_heritage_id = {state.no}
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
              height: "768px",
              transform: "scaleX(-1)",
            }}
          ></canvas>
          <div>
            <button color="primary" onClick={toggleFacingMode}>
              카메라 전환하기
            </button>
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
