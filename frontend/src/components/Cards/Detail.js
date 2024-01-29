import { useEffect, useRef } from "react";
import styled from "styled-components";

const Blurs = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  /* background-color: rgba(0,0,0, 0.4); */
  z-index: 200;
`;
const CardDetail = styled.div`
  width: 50%;
  max-width: 300px;
  height: 400px;
  background-color: white;
  background-image: url(${(props) => props.cardImg});
  background-size: cover;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  z-index: 300;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  color: white;
  font-weight: bold;

  div {
    position: absolute;
    color: black;
    top: 5%;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Detail = (props) => {
  const cardRef = useRef(null);
  useEffect(() => {
    const handleDetail = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        props.setDetail(false);
      }
    };
    document.addEventListener("mousedown", handleDetail);
    return () => {
      document.removeEventListener("mousedown", handleDetail);
    };
  }, [cardRef]);
  return (
    <Blurs>
      <CardDetail id="detail" cardImg={props.cardImg} ref={cardRef}>
        <div>여기에서 설명해요</div>
        {props.des}
      </CardDetail>
    </Blurs>
  );
};

export default Detail;
