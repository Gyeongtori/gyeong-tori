import React from 'react';
import { useLocation } from 'react-router-dom';




const getWebcam = (callback) => {
  try {
    const constraints = {
      'video': true,
      'audio': false
    }
    navigator.mediaDevices.getUserMedia(constraints)
      .then(callback);
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

const Styles = {
  Video: { width: "100%", height: "100%" },
  None: { display: 'none' },
}

function Camera() {
  const [playing, setPlaying] = React.useState(undefined);
  const location = useLocation();
  const key = location.state.no

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
    }
  
    return (<>
        <video ref={videoRef} autoPlay style={Styles.Video} />
        <button color="warning" onClick={() => startOrStop()}>{playing ? 'Stop' : 'Start'} </button>
    </>);
};

export default Camera;