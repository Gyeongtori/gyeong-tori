import { useEffect, useState } from "react";
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
  const user = JSON.parse(localStorage.getItem("user"));
  // const [username, setUsername] = useState({});
  const [myGeo, setMyGeo] = useState({});
  const [socket, setSocket] = useState(null);
  const [mySocket, setMySocket] = useState(null);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    // setUsername(user);

    // socket connection
    setSocket(
      io.connect("/", {
        cors: { origin: "*" },
        transports: ["websocket"],
      })
    );
  }, []); // 처음 렌더링 될 때만 실행
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
        // 위치정보를 가장 높은 정확도로 수신하고 싶음을 나타내는 불리언 값입니다.
        // true를 지정했으면, 지원하는 경우 장치가 더 정확한 위치를 제공합니다.
        // false를 지정한 경우 기기가 더 빠르게 반응하고 전력 소모도 줄일 수 있는 대신 정확도가 떨어집니다.
        enableHighAccuracy: false,
        // 기기가 위치를 반환할 때 소모할 수 있는 최대 시간(밀리초)을 나타내는 양의 long 값입니다.
        timeout: 5000,
        // 캐시에 저장한 위치정보를 대신 반환할 수 있는 최대 시간을 나타내는 양의 long 값입니다.
        // 0을 지정한 경우 장치가 위치정보 캐시를 사용할 수 없으며 반드시 실시간으로 위치를 알아내려 시도해야 한다는 뜻입니다.
        maximumAge: 0,
      }
    );

    console.log(myGeo);
    return () => {
      // stop watchPosition
      navigator.geolocation.clearWatch(watch);
    };
  }, []);
  useEffect(() => {
    if (socket) {
      socket.emit("send_location", {
        lng: "127.00004",
        lat: "67.55553",
        nickname: user.nickname,
        user_id: user.id,
      });
      socket.on("get_location", (data) => {
        if (mySocket === null && data.user_id === user.id) {
          setMySocket(data);
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
      socket.on("get_message", (data) => {
        console.log(data);
      });
    }

    return () => {
      // component unmount ? socket disconnection, remove user from list
      if (socket) {
        socket.disconnect();
        // remove user from list
      }
    };
  }, [socket]); // socket이 변경될 때마다(이벤트 발생) useEffect가 실행되도록 종속성 목록에 포함

  const sendMessageToUser = (opponent) => {
    socket.emit("send_message", {
      // to: userId,
      nickname: user.nickname,
      user_id: user.id,
      socket_id: mySocket.socket_id,
      // 상대방에게 가야한다면 opponent로
      // nickname: opponent.nickname,
      // user_id: opponent.id,
      // socket_id: opponent.socket_id,
      message: `${user.nickname}님이 배틀을 신청하였습니다.`,
    });
    console.log(opponent.user_id, "배틀 신청");
  };
  const sendMessage = () => {
    socket.emit("send_location", {
      lng: "127.00004",
      lat: "67.55553",
      nickname: user.nickname,
      user_id: user.id,
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
