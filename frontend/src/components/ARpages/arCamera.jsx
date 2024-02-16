import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import styled from "styled-components";
import html2canvas from "html2canvas";
import Capture from "./capturePage";
import "./camera.css";

export default function FrontCamera(props) {
  const { state } = useLocation();
  const navigate = useNavigate();

  const rendererRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      1,
      10000
    )
  );

  const videoTextureRef = useRef(null);
  const videoStreamRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImageDataURL, setCapturedImageDataURL] = useState(null);
  const facingMode = "environment";
  const [captureState, setCaptureState] = useState(false);
  const controls = useRef(null);
  const gltfModelRef = useRef(null);

  const backMap = () => {
    navigate("/maps");
  };

  const toggleFacingMode = (state) => {
    navigate('/frontcamera',{
      state: {
        lat: `${state.lat}`,
        lng: `${state.lng}`,
        address: `${state.address}`,
        cultural_heritage_id: `${state.cultural_heritage_id}`
    }})
  }

  const stopVideo = () => {
    const { current: videoStream } = videoStreamRef;
    if (videoStream) {
      const tracks = videoStream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const handelCapture = () => {
    const canvas = canvasRef.current;
    const rendererCanvas = rendererRef.current.domElement; // WebGLRenderer의 캔버스
  
    // WebGLRenderer로 렌더링된 이미지를 가져오기
    const glImageDataURL = rendererCanvas.toDataURL();
  
    // 캡쳐를 위한 새로운 캔버스 생성
    const captureCanvas = document.createElement('canvas');
    captureCanvas.width = window.innerWidth;
    captureCanvas.height = window.innerHeight;
    const ctx = captureCanvas.getContext('2d');
  
    // WebGLRenderer로 렌더링된 이미지를 캡쳐 캔버스에 그리기
    const glImage = new Image();
    glImage.onload = () => {
      ctx.drawImage(glImage, 0, 0);
      
      // 2D 캔버스에 그려진 내용을 html2canvas를 통해 캡쳐
      html2canvas(canvas)
        .then((htmlCanvas) => {
          // 2D 캔버스와 WebGLRenderer 캔버스 이미지 데이터 URL 가져오기
          const imageDataURL = htmlCanvas.toDataURL();
          const glDataURL = captureCanvas.toDataURL();
  
          // 이미지 데이터 URL 설정 및 비디오 정지
          setCapturedImageDataURL(imageDataURL, glDataURL);
          stopVideo();
          setCaptureState(true);
        })
        .catch((error) => {
          console.error("Error capturing canvas:", error);
        });
    };
    glImage.src = glImageDataURL;
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

    scene.add(ambientLight);
    scene.add(directionalLight);

    const loadGltfModel = (scene) => {
      let loader = new GLTFLoader();
      loader.load(
        "metarial/1234.gltf",
        (gltf) => {
          const model = gltf.scene;
          model.position.set(0, 0, 7);
          model.scale.set(0.5,0.5,0.5);
          gltfModelRef.current = model;
          console.log("나 어딘가 있어요")
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

          controls.current = new OrbitControls(
            camera,
            rendererRef.current.domElement
          );
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
      renderer.render(scene, camera);
      if (controls.current) {
        controls.current.update();
      }
    };

    let video;

    const startVideo = () => {
      const constraints = {
        video: {
          facingMode: facingMode,
          frameRate: { max: 60 },
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
          videoMesh.position.z = -5; // 비디오를 카메라 앞으로 이동
          camera.add(videoMesh); // 비디오를 카메라의 자식 요소로 추가
    
          scene.add(camera); // 카메라를 scene에 추가
    
          videoStreamRef.current = stream;
    
          loadGltfModel(scene);
          animate();
        })
        .catch((error) => {
          console.error("Error accessing webcam:", error);
          // 오류 처리 내에서 facingMode 변경
          // setFacingMode("environment");
        });
    };

    const resizeCanvas = () => {
      const canvas = rendererRef.current.domElement;
      canvas.width = window.innerWidth;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas()

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      stopVideo();
      startVideo();
    };
  }, []);
  const handleTouch = (event) => {
    event.preventDefault();

    if (event.target === canvasRef.current) {
      const touchX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      const touchY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2(touchX, touchY);
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects([sceneRef.current], true);

      if (intersects.length > 0) {
        const position = intersects[0].point;
        mountCharacter(position);
      }
    }
  };

  const mountCharacter = (position) => {
    if (gltfModelRef.current) {
      position.z = 7;
      gltfModelRef.current.position.copy(position);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (facingMode === "environment") {
      canvas.style.transform = "scaleX(1)";
    } else if (facingMode === "user") {
      canvas.style.transform = "scaleX(-1)";
    }
  }, [facingMode]);

  useEffect(() => {
    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  const [phoneOrientation, setPhoneOrientation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  function handleOrientation(event) {
    setPhoneOrientation({
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
    });
  }

  function calculatePositionFromOrientation(orientation) {
    const alphaRad = (orientation.alpha * Math.PI) / 180;
    const betaRad = (orientation.beta * Math.PI) / 180;
    const gammaRad = (orientation.gamma * Math.PI) / 180;

    return new THREE.Vector3(alphaRad, betaRad, gammaRad);
  }

  function moveModelToPhonePosition() {
    if (!gltfModelRef.current) return;

    const phonePosition = calculatePositionFromOrientation(phoneOrientation);
    gltfModelRef.current.position.copy(phonePosition);
  }

  return (
    <div onTouchStart={handleTouch}>
      {captureState === true ? (
        captureState && (
          <Capture
            url={capturedImageDataURL}
            state={state}
            address={state.address}
            no={state.no}
            cultural_heritage_id={state.cultural_heritage_id}
            captureState={captureState}
            setCaptureState={setCaptureState}
          />
        )
      ) : (
        <div>
          <BodyMake>
            <canvas
              ref={canvasRef}
              id="canvas"
              style={{ width: "100%", height: "100%" }}
            >
             
            </canvas>
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
