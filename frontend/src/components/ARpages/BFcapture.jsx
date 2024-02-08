import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from "three";
import html2canvas from "html2canvas";
import Capture from "./capturePage";

export default function Camera(props) {
  const { state } = useLocation();
  console.log(state, "이거는 상속받아온 값입니다.");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const videoTextureRef = useRef(null);
  const videoStreamRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImageDataURL, setCapturedImageDataURL] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [captureState, setCaptureState] = useState(false);

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

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    camera.position.set(0, 0, 10);
    const canvas = document.querySelector("#canvas");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      preserveDrawingBuffer: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    const directionalLight = new THREE.DirectionalLight(0xff0000, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(ambientLight);
    scene.add(directionalLight);

    const loadGltfModel = () => {
      let loader = new GLTFLoader();
      loader.load("metarial/1234.gltf", (gltf) => {
        console.log('GLTF 모델이 성공적으로 로드되었습니다.', gltf);
        if (gltf.scene) {
          gltf.scene.traverse((object) => {
            if (object) {
              if (object.isMesh) {
                sceneRef.current.add(object);
              }
            }
          });
          animate();
        } else {
          console.error('GLTF 모델의 씬이 정의되지 않았습니다.');
        }
      }, undefined, (error) => {
        console.error('GLTF 모델 로딩 중 오류:', error);
      });
    }

    const animate = () => {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      requestAnimationFrame(animate);
    }

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
            const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
            const videoGeometry = new THREE.PlaneGeometry(6, 12);
            const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
            scene.add(videoMesh);
            camera.position.y = 1;
            camera.position.z = 7;
            videoStreamRef.current = stream;
            loadGltfModel();
          })
          .catch((error) => {
            console.error("Error accessing webcam:", error);
          });
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    startVideo();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        window.innerWidth * devicePixelRatio,
        window.innerHeight * devicePixelRatio
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      stopVideo();
    };
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
              width: "100%",
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
