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
  justify-content: flex-end;
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
  margin: 10px auto;
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
  align-items: center;
  border-radius: 20px;
  background-color: white;
  color: black;
  &:hover {
    color: white;
    background-color: #9daf89;
  }
`;
const Footer = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 0px;
  width: 80%;
  .close {
    border-radius: 50px;
  }
`;
const DetailPage = () => {
  let navigate = useNavigate();
  const { state } = useLocation();
  const [getGrade, setGrade] = useState(1);
  const [getDate, setDate] = useState(false);
  const ARRAY = [0, 1, 2, 3, 4];

  const prev = () => {
    if (getGrade === 1) console.log("1 등급");
    else setGrade(getGrade - 1);
  };
  const next = () => {
    if (getGrade === 5) console.log("5 등급");
    else setGrade(getGrade + 1);
  };
  const getDates = () => {
    setDate(true);
  };
  console.log(state);
  return (
    <>
      <Frame>
        <Section>
          <Box>
            <Title>{state.cultural_heritage_name}</Title>
            <Grade>
              {ARRAY.map((item, index) =>
                getGrade <= index + 1 ? (
                  <GiAcorn key={index} style={{ color: "red" }} />
                ) : (
                  <GiAcorn key={index} style={{ color: "gray" }} />
                )
              )}
            </Grade>
            <CardImg $cardImg={state.image} />
            <div>
              <FaMapMarkerAlt />
              {state.address}
            </div>
          </Box>
        </Section>
        <Dates onClick={getDates}>획득일</Dates>
        <Des>{state.description}</Des>

        <Footer>
          <button onClick={prev}>
            <GrLinkPrevious />
          </button>
          <button className="close" onClick={() => navigate("/cards")}>
            <GrClose />
          </button>
          <button onClick={next}>
            <GrLinkNext />
          </button>
        </Footer>
      </Frame>
    </>
  );
};

export default DetailPage;
