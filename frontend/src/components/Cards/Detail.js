import { useEffect, useRef } from "react";
import styled from "styled-components";

const Blurs =styled.div`
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
`
const CardDetail = styled.div`
  /* z-index: 1000; */
  /* background-color: white; */
  /* width: 50%;
  height: 50%; */
  /* position: absolute; */
  /* top: 35%;
  left: 50%; */
  /* transform: translate(-50%, -50%); */
  width: 50%;
  max-width: 300px;
  height: 400px;
  background-color: white;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 0, 0.5),
    rgba(0, 0, 255, 0.5)
  ),url('https://picsum.photos/seed/picsum/300/400');
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

  div {
    position: absolute;
    top: 5%;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Detail = (props) => {
  const cardRef = useRef(null);
  
  useEffect(() => { 
    const handleDetail = (e) => {
      if(cardRef.current && !cardRef.current.contains(e.target)) {
        props.setDetail(false);
      }
    }
    document.addEventListener("mousedown", handleDetail);
    return () => {document.removeEventListener("mousedown", handleDetail);}
  }, [cardRef])
  return (
    <Blurs>
      <CardDetail id="detail" ref={cardRef} ><div>여기에서 설명해요</div>뇽</CardDetail>

    </Blurs>
  )
}

export default Detail;