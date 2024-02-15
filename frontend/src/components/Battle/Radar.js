import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import io from "socket.io-client";

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

const RandomButton = styled.button`
  position: absolute;
  top: ${(props) => props.$top}%;
  left: ${(props) => props.$left}%;
`;
const Radar = () => {
  const user = JSON.parse(localStorage.getItem("user")); // user 정보
  const [myGeo, setMyGeo] = useState({}); // 현재 사용자 위치 정보
  const [socket, setSocket] = useState(null); // 소켓 연결 정보
  const mySocket = useRef(null); // 현재 사용자 소켓 정보
  const [userList, setUserList] = useState([]); // 현재 사용자 주변 사용자 리스트
  const [battleState, setBattleState] = useState(false); // 현재 배틀 상태 정보

  // 소켓 연결
  useEffect(() => {
    // socket connection
    setSocket(
      io.connect("/", {
        cors: { origin: "*" },
        transports: ["websocket"],
      })
    );
  }, []); // 처음 렌더링 될 때만 실행

  // 현재 사용자 위치 정보
  useEffect(() => {
    // geolocation
    // watchPosition(): https://developer.mozilla.org/ko/docs/Web/API/Geolocation/watchPosition
    // options: https://developer.mozilla.org/ko/docs/Web/API/Geolocation/getCurrentPosition
    const watch = navigator.geolocation.watchPosition(
      (position) => {
        setMyGeo({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error Code = " + error.code + " - " + error.message);
      },
      {
        maximumAge: 0,
      }
    );

    console.log(myGeo);
    return () => {
      // stop watchPosition
      navigator.geolocation.clearWatch(watch);
    };
  }, []);

  // 소켓 이벤트, socket 값이 변경될 때 마다 실행
  useEffect(() => {
    if (socket) {
      // 사용자 정보 브로드 캐스트
      socket.emit("send_location", {
        lng: myGeo.lng,
        lat: myGeo.lat,
        nickname: user.nickname,
        user_id: user.id,
      });

      // 다른 사용자 정보 리스닝 이벤트
      socket.on("get_location", (data) => {
        if (mySocket.current === null && data.user_id === user.id) {
          // setMySocket(data);
          mySocket.current = data;
        }
        if (data.user_id !== user.id) {
          setUserList((prev) => {
            if (!prev.find((user) => user.user_id === data.user_id)) {
              return [...prev, data];
            } else {
              return prev;
            }
          });
        }
      });

      // 배틀 신청 수락 여부 리스닝 이벤트
      socket.on("get_message", (data) => {
        console.log(data);
        // let msg = window.confirm(data.message);
        let msg = getConfirm(data.message);
        console.log(msg);
        if (msg) {
          setBattleState(true);
          // 배틀 신청 수락 emit
          socket.emit("send_message", {
            socket_id: data.opponent_socket_id,
            opponent_socket_id: data.socket_id,
            message: `${user.nickname}님이 배틀을 수락하였습니다.`,
          });
        } else {
          setBattleState(false);
          // 배틀 신청 거절 emit
          socket.emit("send_message", {
            socket_id: mySocket.current?.socket_id,
            opponent_socket_id: data.opponent_socket_id,
            message: `${user.nickname}님이 배틀을 거절하였습니다.`,
          });
        }
      });

      // 소켓 연결 없는 사용자 리스트 제거
      socket.on("get_exit", (data) => {
        console.log(data);
        setUserList((prev) =>
          prev.filter((user) => user.user_id !== data.user_id)
        );
      });
    }
    // console.log(mySocket);

    // 컴포넌트 언마운트시 소켓 연결 해제
    // component unmount ? socket disconnection, remove user from list
    return () => {
      if (socket) {
        // remove user from list 브로드 캐스트
        socket.emit("send_exit", {
          nickname: user.nickname,
          user_id: user.id,
          socket_id: mySocket.current?.socket_id,
        });
        // 소켓 연결 해제
        socket.disconnect();
        // 사용자 소켓 정보 초기화
        mySocket.current = null;
      }
    };
  }, [socket]); // socket이 변경될 때마다(이벤트 발생) useEffect가 실행되도록 종속성 목록에 포함

  // 사용자 배틀 신청 emit
  const sendMessageToUser = (opponent) => {
    socket.emit("send_message", {
      socket_id: mySocket.current?.socket_id, // 송신자
      opponent_socket_id: opponent.socket_id, // 수신자
      message: `${user.nickname}님이 배틀을 신청하였습니다.`,
    });
    console.log(opponent.user_id, "배틀 신청");
  };

  // 사용자 배틀 수락 여부 팝업
  const getConfirm = (msg) => {
    let res = window.confirm(msg);
    return res;
  };

  // const sendMessage = () => {
  //   socket.emit("send_location", {
  //     lng: myGeo.lng,
  //     lat: myGeo.lat,
  //     nickname: user.nickname,
  //     user_id: user.id,
  //   });
  // };
  const sendQuestion = async () => {
    const res = await axios.post("/v1/question/list", {
      card_list: [11, 12, 13, 14],
    });
    console.log(res);
  };

  return (
    <>
      {userList.map((user) => (
        <RandomButton
          key={user.user_id}
          $top={Math.random() * 100} // top 위치를 랜덤하게 결정합니다.
          $left={Math.random() * 100} // left 위치를 랜덤하게 결정합니다.
          onClick={() => sendMessageToUser(user)}
        >
          {user.nickname}
        </RandomButton>
      ))}

      {/* <button style={{ zIndex: 1000 }} onClick={sendMessage}>
        위치
      </button> */}
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
