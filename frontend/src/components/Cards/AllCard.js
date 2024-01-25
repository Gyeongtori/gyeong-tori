import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Detail from "./Detail";
import { db } from "../../firebase";
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px 1vw;
  transform-style: preserve-3d;
  height: 100%;
  position: relative;
  transition: all 0.1s;
`;
const Container = styled.div`
  width: 170px;
  height: 250px;
  margin: 0 auto;
  transition: all 0.1s;
  position: relative;
  transform: ${(props) => props.rotation};
`;
const Overlay = styled.div`
  position: absolute;
  width: 175px;
  height: 250px;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 219, 112, 0.8) 45%,
    rgba(132, 50, 255, 0.6) 50%,
    transparent 54%
  );
  filter: ${(props) => props.filter};
  mix-blend-mode: color-dodge;
  background-size: 150% 150%;
  background-position: ${(props) => props.position};
  transition: all 0.1s;
`;

const CardImg = styled.div`
  width: 175px;
  height: 250px;
  background-image: url("https://picsum.photos/seed/picsum/175/250");
  background-size: cover;
  margin: 0 auto;
`;

const AllCard = () => {
  useEffect(() => {
    console.log(db);
  }, []);
  const [states, setStates] = useState(
    Array(5).fill({ rotation: "", position: "50%", filter: "opacity(0)" })
  );
  const [getdetail, setDetail] = useState(false);
  // const [rotation, setRotation] = useState('');
  // const [position, setPosition] = useState('50%');
  // const [filter, setFilter] = useState('brightness(1.1) opacity(0.8);');

  const handleMouseMove = (index, e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const rotateY = (-1 / 5) * x + 20;
    const rotateX = (4 / 30) * y - 20;

    // setPosition(`${x/5 + y/5}%;`);
    // setFilter(`opacity(${x/200}) brightness(1.2)`);
    // setRotation(`perspective(350px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
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

  const handleDetail = (e) => {
    const cardId = e.target.id;
    console.log(cardId);
    console.log("클릭됐땅");
    setDetail(true);
  };
  return (
    <>
      <div>
        {getdetail ? <Detail setDetail={setDetail} /> : null}
        <CardGrid>
          {states.map((state, index) => (
            <Container
              key={index}
              rotation={state.rotation}
              onMouseMove={(e) => handleMouseMove(index, e)}
              onMouseOut={() => handleMouseOut(index)}
            >
              <Overlay
                id={index}
                onClick={handleDetail}
                position={state.position}
                filter={state.filter}
              />
              <CardImg />
            </Container>
          ))}
        </CardGrid>
      </div>
    </>
  );
};

export default AllCard;
