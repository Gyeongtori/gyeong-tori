import { Outlet } from "react-router-dom";
import styled from "styled-components";

let Mobile = styled.div`
  width: 22.5rem;
  /* height: 50rem;   */
  /* height: calc(var(--vh, 1vh) * 100); */
  /* height: 100vh;
  max-width: 400px;
  margin-left: auto; */
  margin-right: auto;
  background-color: #f2f2f2;
  /* overflow-x: visible;
  overflow-y: auto; */
`;

const MobileDiv = () => {
  return (
    <Mobile>
      <Outlet></Outlet>
    </Mobile>
  )
}

export default MobileDiv;