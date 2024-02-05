import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Camera() {
  const getWebcam = (callback) => {
    try {
      const constraints = {
        video: { facingMode: 'user' },
        audio: false,
      };
      navigator.mediaDevices.getUserMedia(constraints)
        .then(callback);
    } catch (err) {
      console.log(err);
      return undefined;
    }
  };

  const Styles = {
    Video: { width: "100%", height: "100%" },
    None: { display: 'none' },
  };

  const VideoDisplay = () => {
    const [playing, setPlaying] = React.useState(undefined);
    const location = useLocation();
    const videoRef = React.useRef(null);

    React.useEffect(() => {
      getWebcam((stream => {
        setPlaying(true);
        videoRef.current.srcObject = stream;
      }));
    }, []);

    const startOrStop = () => {
      if (playing) {
        const s = videoRef.current.srcObject;
        s.getTracks().forEach((track) => {
          track.stop();
        });
      } else {
        getWebcam((stream => {
          setPlaying(true);
          videoRef.current.srcObject = stream;
        }));
      }
      setPlaying(!playing);
    };

    const [facingMode,setFacingMode] = useState('user')

    const toggleFacingMode = (pros) => {
      setFacingMode(prevFacingMode => (prevFacingMode === 'user' ? 'environment' : 'user'));
    };

    return (
      <>
        <video ref={videoRef} autoPlay style={{ transform: 'scaleX(-1)' }} />
        <button color="warning" onClick={() => startOrStop()}>{playing ? 'Start' : 'Stop'} </button>
        <button color='primary' onClick={() => toggleFacingMode()}>카메라 전환하기</button>
      </>
    );
  };

  return <VideoDisplay />;
}
