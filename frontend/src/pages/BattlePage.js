import styled from "styled-components";
import Radar from "../components/Battle/Radar";
import Toggle from "../components/Battle/Toggle";

const RadarDiv = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const MainPage = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #DFE7DA;
`;

const BattlePage = () => {
  return (
    <MainPage>
      <RadarDiv>
        <Radar />
      </RadarDiv>
      <Toggle/>
    </MainPage>
  );
};
export default BattlePage;
