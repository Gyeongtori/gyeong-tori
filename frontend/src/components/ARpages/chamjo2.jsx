import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Camera() {
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const videoTextureRef = useRef(null);
    const videoMeshRef = useRef(null);
    const videoStreamRef = useRef(null);
    function toggleFacingMode(facingMode){
      facingMode = facingMode ==='user'?'environment' : 'user'
      console.log(facingMode)
    }

    useEffect(() => {
        // 새로운 THREE.js 씬, 카메라 및 렌더러 생성
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const canvas = document.querySelector('#canvas')
        const renderer = new THREE.WebGLRenderer({canvas});
        renderer.setSize(window.innerWidth, window.innerHeight);
        // useRef를 사용하여 렌더러, 씬 및 카메라에 대한 참조 설정
        rendererRef.current = renderer;
        document.body.appendChild(renderer.domElement);
        sceneRef.current = scene;
        cameraRef.current = camera;
      
        let video;
        let videoStream;

        let facingMode = 'user'
        toggleFacingMode(facingMode)
      


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
                const videoGeometry = new THREE.PlaneGeometry(16, 9);
                const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
                scene.add(videoMesh);
                videoMeshRef.current = videoMesh;
    
                camera.position.z = 5;
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
        }

        // 비디오 시작 함수 호출
        startVideo();

        // 창 크기 조절 이벤트 핸들러
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        // 창 크기 조절 이벤트 리스너 등록
        window.addEventListener('resize', handleResize);

        // useEffect의 cleanup 함수
        return () => {
            // 이벤트 리스너 제거
            window.removeEventListener('resize', handleResize);
            // 비디오 스트림 정리
            if (videoStream) {
                const tracks = videoStream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []); // useEffect의 두번째 매개변수인 빈 배열은 컴포넌트가 마운트될 때 한번만 실행되도록 합니다.
    
    return (
      <>
      <canvas id='canvas'>
     
      </canvas>
      <button color='primary' >카메라 전환하기</button>
      <button onClick={toggleFacingMode}>버튼을 눌러봐여 </button>
      </>
    )
}
