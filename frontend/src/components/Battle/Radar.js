import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import io from "socket.io-client";
// 1. io.connect와 동일하게 설정
// 2. 백엔드 서버에 대한 URL 전달
const socket = io.connect("/", {
  cors: { origin: "*" },
  transports: ["websocket"],
  secure: true,
});

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
  z-index: -1;
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
  z-index: -1;
`;
const Radar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [username, setUsername] = useState({});

  useEffect(() => {
    setUsername(user);

    socket.emit("send_location", {
      lng: "127.00004",
      lat: "67.55553",
      nickname: user.nickname,
      user_id: user.id,
    });
    socket.on("get_location", (data) => {
      console.log(data);
    });
  }, [socket]); // socket이 변경될 때마다(이벤트 발생) useEffect가 실행되도록 종속성 목록에 포함

  const sendMessage = () => {
    socket.emit("send_location", {
      lng: "127.00004",
      lat: "67.55553",
      nickname: username.nickname,
      user_id: username.id,
    });
  };
  const sendQuestion = async () => {
    const res = await axios.post("/v1/question/list", {
      card_list: [51, 52, 53, 54],
    });
    console.log(res);
  };
  const getUsers = () => {
    socket.on("get_location", (data) => {
      console.log(data);
    });
  };
  return (
    <>
      <button style={{ zIndex: 1000 }} onClick={getUsers}>
        사용자 불러오기
      </button>
      <button style={{ zIndex: 1000 }} onClick={sendMessage}>
        위치
      </button>
      <button style={{ zIndex: 1000 }} onClick={sendQuestion}>
        문제 제시
      </button>
      <OuterCircle>
        <GreenScanner></GreenScanner>
      </OuterCircle>
    </>
  );
};
export default Radar;
