import { useEffect, useState } from "react";
import styled from "styled-components";
/**
 *
 * socket.io message example
 * https://youtu.be/djMy4QsPWiI?si=YY0xH8yQO5_eUJbi
 *
 * @author TakHaYoon
 *
 */
// socket.io-client 라이브러리 import
import io from "socket.io-client";

// 1. io.connect와 동일하게 설정
// 2. 백엔드 서버에 대한 URL 전달
const socket = io.connect("http://localhost:8085");

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

  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [room, setRoom] = useState(""); // server에서 join 이벤트 사용 [socket.on("join_room", (data) => {socket.join(data)})]
  // 사용자가 직접 room 번호를 입력한 경우
  const joinRoom = () => {
    if (room !== "") {
      // 이벤트를 내보내고 사용자가 입력한 방 번호 전송
      socket.emit("join_room", room); // 해당하는 방 번호에 참여하기 위한 이벤트 발생
    }
  };

  setMessage("Hello");
  // message example
  // socket.emit() : message 방출
  // .emit("전달할 함수 명", 전달할 값)
  const sendMessage = () => {
    // socket.emit("send_message", { message: "Hello" });
    // room을 지정한 경우 이 메시지를 누구에게 보낼지 지정해야 하기 때문에 어느 방에 있는지 보내기
    socket.emit("send_message", { message, room });
    // 서버에서는 socket.to(data.room).emit("receive_message", data)로 room에 해당하는 클라이언트에게만 메시지 전송
  };

  // message를 받을 때마다 호출
  // 즉, 서버에서 이벤트가 발생할 때마다 실행되는 함수와 같은 역할
  useEffect(() => {
    // 이벤트가 발생할 경우를 대비하여 이벤트를 수신하고 있다고 선언
    // socket.on() : 이벤트 수신
    // .on("수신 이벤트 함수", 데이터 수신 콜백 함수)
    socket.on("receive_message", (data) => {
      // alert(data.message);
      // console.log(data.message);
      setMessageReceived(data.message);
    });
  }, [socket]); // socket이 변경될 때마다(이벤트 발생) useEffect가 실행되도록 종속성 목록에 포함
  return (
    <OuterCircle>
      <GreenScanner></GreenScanner>
    </OuterCircle>
  );
};
export default Radar;
