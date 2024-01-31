import { useState } from "react";
import styled from "styled-components";
const OuterCircle = styled.div`
  width: 240px;
  height: 240px;
  border-radius: 50%;
  box-shadow: 0 0 8px 0 #aaa;
  position: relative;
  &::before,
  &::after {
    content: "";
    width: 240px;
    height: 240px;
    border-radius: 50%;
    position: absolute;
    border: 1px solid #eee;
    animation: ripple 2s infinite linear;
  }

  &::after {
    animation-delay: 1s;
  }

  @keyframes scan {
    to {
      transform: rotate(1turn);
    }
  }

  @keyframes ripple {
    to {
      transform: scale(2.5);
    }
  }
`;

const GreenScanner = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(#00ff0055, #00ff00);
  position: absolute;
  top: 20px;
  left: 20px;
  animation: scan 4s infinite linear;

  @keyframes identifier {
    to {
      transform: rotate(1turn);
    }
  }
`;
const Radar = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  
  return (
    <OuterCircle>
      <GreenScanner></GreenScanner>
    </OuterCircle>
  );
};
export default Radar;
