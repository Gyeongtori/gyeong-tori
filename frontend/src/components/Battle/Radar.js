import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import io from "socket.io-client";
import Battle from "../../assets/Battle.png";


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
  background: conic-gradient(#758467, #9CAF88);
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

const RandomButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  // 버튼 커스텀 하기
  position: absolute;
  top: ${(props) => props.$top}%;
  left: ${(props) => props.$left}%;
`;

const BattleUserName = styled.div`
  font-family: 'omyu_pretty';
  font-size: large;
`;

const BattleUserIMG = styled.div`
  background-image: url(${Battle});
  background-size: cover;
  background-repeat: no-repeat;
  width: 5rem;
  height: 5rem;
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
        lng: myGeo.lng,
        lat: myGeo.lat,
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
      socket.on("get_exit", (data) => {
        console.log(data);
        setUserList((prev) =>
          prev.filter((user) => user.user_id !== data.user_id)
        );
      });
    }
    console.log(mySocket);
    return () => {
      // component unmount ? socket disconnection, remove user from list
      if (socket) {
        // remove user from list
        socket.emit("send_exit", {
          nickname: user.nickname,
          user_id: user.id,
          socket_id: mySocket.socket_id,
        });
        socket.disconnect();
      }
    };
  }, [socket]); // socket이 변경될 때마다(이벤트 발생) useEffect가 실행되도록 종속성 목록에 포함

  const sendMessageToUser = (opponent) => {
    socket.emit("send_message", {
      socket_id: mySocket.socket_id,
      opponent_socket_id: opponent.socket_id,
      message: `${user.nickname}님이 배틀을 신청하였습니다.`,
    });
    console.log(opponent.user_id, "배틀 신청");
  };
  const sendMessage = () => {
    socket.emit("send_location", {
      lng: myGeo.lng,
      lat: myGeo.lat,
      nickname: user.nickname,
      user_id: user.id,
    });
  };
  const sendQuestion = async () => {
    const res = await axios.post("/v1/question/list", {
      card_list: [11, 12, 13, 14],
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
      <>
        {userList.map((user) => (
          <>
            <RandomButton
              key={user.user_id}
              $top={Math.random() * 100} // top 위치를 랜덤하게 결정합니다.
              $left={Math.random() * 100} // left 위치를 랜덤하게 결정합니다.
              onClick={() => sendMessageToUser(user)}
            >
              <BattleUserIMG></BattleUserIMG>
              <BattleUserName>{user.nickname}</BattleUserName>
            </RandomButton>
          </>
        ))}
      </>
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
