import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
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

const Footer = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 0px;
  width: 80%;
`;
const DetailPage = () => {
  const { state } = useLocation();
  let navigate = useNavigate();
  console.log(state);
  return (
    <>
      <Frame>
        <Section>
          <Box>
            <Title>{state.cultural_heritage_name}</Title>
            <Grade>등급표시</Grade>
            <CardImg $cardImg={state.image} />
          </Box>
        </Section>

        <Des>{state.description}</Des>

        <Footer>
          <div>이전</div>
          <button onClick={() => navigate("/cards")}>닫기</button>
          <div>다음</div>
        </Footer>
      </Frame>
    </>
  );
};

export default DetailPage;
