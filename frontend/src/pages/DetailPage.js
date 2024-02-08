import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { GiAcorn } from "react-icons/gi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GrLinkPrevious, GrClose, GrLinkNext } from "react-icons/gr";
const Frame = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: #cad6c0;
`;
const Box = styled.div`
  margin: 20px auto;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
`;
const Section = styled.div`
  flex: 1;
`;
const Title = styled.div`
  text-align: center;
  font-size: 1.875rem;
  font-weight: bold;
`;
const Grade = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  div {
    margin: 0 31.5px;
  }
`;
const CardImg = styled.div`
  width: 270px;
  height: 350px;
  background-size: cover;
  background-image: url(${(props) => props.$cardImg});
`;
const Des = styled.div`
  display: flex;
  justify-content: center;
  margin: 5px auto;
  width: 80%;
  padding: 10px;
  max-height: 30vh;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 20px;
  }
  &::-webkit-scrollbar-thumb {
    height: 30%;
    background: #848484;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: #848484;
  }
`;
const Dates = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 0 31.5px;
  div {
    align-items: center;
    padding: 5px;
    border-radius: 20px;
    background-color: white;
    color: black;
  }
  .div:hover {
    color: white;
    background-color: #9daf89;
  }
`;
const MoveBtn = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0;
  padding: 0.5rem 1rem;

  font-family: "Noto Sans KR", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  text-decoration: none;

  display: inline-block;
  width: auto;

  border: none;
  border-radius: 4px;
  background: transparent;
`;
const CloseBtn = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0;
  padding: 0.5rem 1rem;

  font-family: "Noto Sans KR", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  text-decoration: none;

  display: inline-block;
  width: auto;

  border: none;
  border-radius: 4px;
  background: transparent;
  border-radius: 50px;
`;
const Footer = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 0px;
  width: 80%;
`;
const DetailPage = () => {
  let navigate = useNavigate();
  const { state } = useLocation();
  const [getGrade, setGrade] = useState(1);
  const [prevAble, setPrevAble] = useState(true);
  const [nextAble, setNextAble] = useState(false);
  const [getDate, setDate] = useState(false);
  const ARRAY = [1, 2, 3, 4, 5];
  const prev = () => {
    console.log(getGrade);
    if (getGrade === 1) setPrevAble(true);
    else {
      setGrade(getGrade - 1);
      setNextAble(false);
    }
  };
  const next = () => {
    setGrade(getGrade + 1);
    setPrevAble(false);
    console.log(getGrade);
    if (getGrade === 4) setNextAble(true);
  };
  const getDates = () => {
    setDate(true);
    console.log(state.grade_cards[getGrade - 1].holding_cards);
  };
  // console.log(state);
  return (
    <>
      <Frame>
        <Section>
          <Box>
            <Title>{state.cultural_heritage_name}</Title>
            <Grade>
              <div>
                {ARRAY.map((index) =>
                  getGrade >= index ? (
                    <GiAcorn key={index} style={{ color: "brown" }} />
                  ) : (
                    <GiAcorn key={index} style={{ color: "gray" }} />
                  )
                )}
              </div>
            </Grade>
            <CardImg $cardImg={state.image} />
            <div>
              <FaMapMarkerAlt />
              {state.address}
            </div>
          </Box>
        </Section>
        <Dates>
          <div onClick={getDates}>획득일</div>
        </Dates>
        <Des>{state.description}</Des>

        <Footer>
          <MoveBtn onClick={prev} disabled={prevAble}>
            <GrLinkPrevious />
          </MoveBtn>
          <CloseBtn onClick={() => navigate("/cards")}>
            <GrClose />
          </CloseBtn>
          <MoveBtn onClick={next} disabled={nextAble}>
            <GrLinkNext />
          </MoveBtn>
        </Footer>
      </Frame>
    </>
  );
};

export default DetailPage;
