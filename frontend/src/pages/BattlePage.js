import styled from "styled-components";
import Radar from "../components/Battle/Radar";
import Toggle from "../components/Battle/Toggle";
import { useState } from "react";
const Frame = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: #dfe7da;
`;
const BattlePage = () => {
  return (
    <>
      <Frame>
        <Radar />
        <Toggle />
      </Frame>
    </>
  );
};
export default BattlePage;
