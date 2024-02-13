import styled from "styled-components";
import Radar from "../components/Battle/Radar";
const RadarDiv = styled.div`
  position: fixed;
  bottom: 0px;
`;

const BattlePage = () => {
  return (
    <>
      <div>Main화면과 동일하게 작용해요</div>
      <RadarDiv>
        <Radar />
      </RadarDiv>
    </>
  );
};
export default BattlePage;
