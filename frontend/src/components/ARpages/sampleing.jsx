import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function Camera() {
  let facingMode = 'user';
  function toggleFacingMode(){
    facingMode = !facingMode
  }
  const videoRef = useRef(null); // useRef로 videoRef 초기화
  let videoStream = null;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  const videoTexture = new THREE.VideoTexture(videoRef.current); // videoRef.current를 사용하여 video 엘리먼트에 대한 ref 접근
  const [playing, setPlaying] = React.useState(false);
  const startOrStop = () => {
    if (playing) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoStream = stream;
        if (videoRef.current) { // videoRef가 null이 아닌 경우에만 실행
          videoRef.current.srcObject = stream; // video 엘리먼트에 스트림 설정
          videoRef.current.play(); // 비디오 재생
        }
      }).catch((error) => {
        console.error('Error accessing webcam:', error);
      });
    } else {
      if (videoStream) {
        const tracks = videoStream.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
    setPlaying(!playing);
  };
  useEffect(() => {
    const initThree = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
      const videoGeometry = new THREE.PlaneGeometry(16, 9);
      const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);

      scene.add(videoMesh);

      camera.position.z = 5;

      const animate = () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          videoTexture.needsUpdate = true;
        }

        // 렌더링 및 다음 프레임 요청
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      animate();
    };

    initThree();
  }, [videoTexture]);

  return (
    <>
      <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '100vw', height: 'auto', transform: 'scaleX(-1)' }} />
      <button color="warning" onClick={() => startOrStop()}>{playing ? 'Stop' : 'start'} </button>
      <button color='primary' onClick={() => toggleFacingMode()}>카메라 전환하기</button>
    </>
  );
}
