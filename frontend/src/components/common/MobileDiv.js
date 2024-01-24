import { Outlet } from "react-router-dom";
import styled from "styled-components";

let Mobile = styled.div`
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  background-color: #f2f2f2;
`;

const MobileDiv = () => {
  return (
    <Mobile>
      <Outlet></Outlet>
    </Mobile>
  )
}

export default MobileDiv;