import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
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
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const modelSceneRef = useRef(new THREE.Scene());
  const videoSceneRef = useRef(new THREE.Scene());
  const videoTextureRef = useRef(null);
  const videoStreamRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImageDataURL, setCapturedImageDataURL] = useState(null);
  const facingMode = "user"
  const [captureState, setCaptureState] = useState(false);
  const gltfModelRef = useRef(null);

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
    directionalLight.position.set(0, 1, 0);

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
          model.position.set(0, 0, 0);
          gltfModelRef.current = model;
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
        },
        undefined,
        (error) => {
          console.error("An error happened:", error);
        }
      );
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
            videoTexture.magFilter = THREE.LinearFilter;
          videoTexture.minFilter = THREE.LinearFilter;
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
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (facingMode === "environment") {
      canvas.style.transform = "scaleX(1)";
    } else if (facingMode === "user") {
      canvas.style.transform = "scaleX(-1)";
    }
  }, []);

  useEffect(() => {
    window.addEventListener('deviceorientation', handleOrientation);

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
    const alphaRad = orientation.alpha * Math.PI / 180;
    const betaRad = orientation.beta * Math.PI / 180;
    const gammaRad = orientation.gamma * Math.PI / 180;

    return new THREE.Vector3(alphaRad, betaRad, gammaRad);
  }

  function moveModelToPhonePosition() {
    if (!gltfModelRef.current) return;

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
