import React, { useEffect, useRef, useState } from 'react';

import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

import html2canvas from 'html2canvas';
import saveAs from 'file-saver';

export default function Camera() {
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const videoTextureRef = useRef(null);
    const videoMeshRef = useRef(null);
    const videoStreamRef = useRef(null);
    const canvasRef = useRef(null);

    const [capturedImageDataURL,setCapturedImageDataURL] =useState(null);
    const [facingMode, setFacingMode] = useState('user');
    
    const handelCapture = () => {
      const canvas = canvasRef.current;

      html2canvas(canvas)
      .then((canvas)=> {
        const imageDataURL = canvas.toDataURL();
        console.log(imageDataURL);
        setCapturedImageDataURL(imageDataURL);
      })
      .catch((error) => {
        console.error('Error capturing canvas:', error);
      });
    }

    const handleDownload = () => {
      // 캡쳐된 이미지 데이터 URL을 이용하여 다운로드
      if (capturedImageDataURL) {
        const downloadLink = document.createElement('a');
        downloadLink.href = capturedImageDataURL;
        downloadLink.download = 'captured_image.png';
    
        // 다운로드 링크 클릭
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        console.error('No captured image data to download.');
      }
    };

    function toggleFacingMode(){
      setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
    }
    // 여기부터
    useEffect(() => {
        // 새로운 THREE.js 씬, 카메라 및 렌더러 생성
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const canvas = document.querySelector('#canvas');
        const renderer = new THREE.WebGLRenderer({canvas, preserveDrawingBuffer: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        // useRef를 사용하여 렌더러, 씬 및 카메라에 대한 참조 설정
        rendererRef.current = renderer;
        document.body.appendChild(renderer.domElement);
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
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                video = document.createElement('video');
                video.srcObject = stream;
                video.play();

                const videoTexture = new THREE.VideoTexture(video);
                videoTextureRef.current = videoTexture;
                const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
                const videoGeometry = new THREE.PlaneGeometry(9, 16);
                const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
                scene.add(videoMesh);
                videoMeshRef.current = videoMesh;

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
            }).catch((error) => {
                console.error('Error accessing webcam:', error);
            });
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
        };

        // 비디오 시작 함수 호출
        startVideo();

        // 창 크기 조절 이벤트 핸들러
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(10000,window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio);
        };

        // 창 크기 조절 이벤트 리스너 등록
        window.addEventListener('resize', handleResize);

        // useEffect의 cleanup 함수
        return () => {
            // 이벤트 리스너 제거
            window.removeEventListener('resize', handleResize);
            // 비디오 스트림 정리
            const { current: videoStream } = videoStreamRef;
            if (videoStream) {
                const tracks = videoStream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [facingMode]); // facingMode 변수가 변경될 때마다 useEffect가 다시 실행됨
    // 요기까지 유즈 이펙트

    
    return (
      <>
      <canvas ref={canvasRef} id='canvas' style={{ width: '100%', maxWidth: '100vw', height: '70%', transform: 'scaleX(-1)' }}>
     
      </canvas>
      <button color='primary' onClick={toggleFacingMode}>카메라 전환하기</button>
      <button onClick={handelCapture}>캡쳐하기</button>
      <button onClick={handleDownload}>사진저장하기</button>
      </>
    );
}
