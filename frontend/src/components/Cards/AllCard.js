import React, { useEffect, useState } from "react";
import styled from "styled-components";
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px 0vh;
  transform-style: preserve-3d;
  height: 100%;
  position: relative;
  transition: all 0.1s;
`;
const Container = styled.div`
  width: 170px;
  height: 250px;
  border-radius: 20px;
  margin: 0 auto;
  transition: all 0.1s;
  position: relative;
  transform: ${(props) => props.$rotation};
`;
const Overlay = styled.div`
  position: absolute;
  width: 175px;
  height: 250px;
  border-radius: 20px;
  margin: 0 auto;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 219, 112, 0.8) 45%,
    rgba(132, 50, 255, 0.6) 50%,
    transparent 54%
  );
  filter: ${(props) => props.$filter};
  mix-blend-mode: color-dodge;
  background-size: 150% 150%;
  background-position: ${(props) => props.$position};
  transition: all 0.1s;
`;

const CardImg = styled.div`
  width: 170px;
  height: 250px;
  border-radius: 20px;
  margin: 0 auto;

  -webkit-box-shadow: inset 0px 0px 0px 3px #9daf89;
  -moz-box-shadow: inset 0px 0px 0px 3px #9daf89;
  box-shadow: inset 0px 0px 0px 3px #9daf89;
  background-image: ${(props) => `url("${props.$url}")`};
  background-color: ${(props) => props.$black};
  background-blend-mode: multiply;
  background-size: cover;
  margin: 0 auto;
`;

const AllCard = (props) => {
  const [states, setStates] = useState([]); // 카드 CSS 적용 모두 담기
  const [load, setLoad] = useState(false);

  useEffect(() => {
    // console.log(db); // firebase 연결 테스트
    let lens = props.card.length;
    let setting = [];
    setting = Array(lens).fill({
      rotation: "perspective(350px) rotateY(0deg) rotateX(0deg)",
      position: "50%",
      filter: "opacity(0)",
    });
    setStates(setting);
    setLoad(true);
  }, []);

  const handleMouseMove = (index, e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const rotateY = (-1 / 5) * x + 20;
    const rotateX = (4 / 30) * y - 20;

    const newState = {
      rotation: `perspective(350px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      position: `${x / 5 + y / 5}%`,
      filter: `opacity(${x / 200}) brightness(1.2)`,
    };

    setStates((pre) => {
      const newStates = [...pre];
      newStates[index] = newState;
      return newStates;
    });
  };
  const handleTouchMove = (index, e) => {
    const x = e.changedTouches[0].pageX;
    const y = e.changedTouches[0].pageY;

    const rotateY = (-1 / 5) * x + 20;
    const rotateX = (4 / 30) * y - 20;

    const newState = {
      rotation: `perspective(350px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      position: `${x / 5 + y / 5}%`,
      filter: `opacity(${x / 200}) brightness(1.2)`,
    };

    setStates((pre) => {
      const newStates = [...pre];
      newStates[index] = newState;
      return newStates;
    });
  };
  const handleMouseOut = (index) => {
    setStates((pre) => {
      const newStates = [...pre];
      newStates[index] = {
        rotation: "perspective(350px) rotateY(0deg) rotateX(0deg)",
        position: "50%",
        filter: "opacity(0)",
      };
      return newStates;
    });
  };
  const handleTouchOut = (index) => {
    setStates((pre) => {
      const newStates = [...pre];
      newStates[index] = {
        rotation: "perspective(350px) rotateY(0deg) rotateX(0deg)",
        position: "50%",
        filter: "opacity(0)",
      };
      return newStates;
    });
  };
  const handleDetail = (e) => {
    const id = e.target.id;
    // console.log(id);
    props.setCardId(id);
    props.setDetail(true);
    // navigate("/detail", { state: card[id] });
  };
  return (
    <>
      {load && (
        <div>
          <CardGrid>
            {states &&
              states.map((state, index) =>
                props.card[index].have ? (
                  <Container
                    key={index}
                    $rotation={state.rotation}
                    onMouseMove={(e) => handleMouseMove(index, e)}
                    onTouchMove={(e) => handleTouchMove(index, e)}
                    onMouseOut={() => handleMouseOut(index)}
                    onTouchEnd={() => handleTouchOut(index)}
                  >
                    <Overlay
                      id={index}
                      onClick={handleDetail}
                      $position={state.position}
                      $filter={state.filter}
                    />
                    <CardImg $url={props.card[index].image} />
                  </Container>
                ) : (
                  <Container key={index} $rotation={state.rotation}>
                    <Overlay
                      id={index}
                      $position={state.position}
                      $filter={state.filter}
                    />
                    <CardImg
                      $url={props.card[index].image}
                      $black={"rgba(0, 0, 0, 0.7)"}
                    />
                  </Container>
                )
              )}
          </CardGrid>
        </div>
      )}
    </>
  );
};

export default AllCard;
