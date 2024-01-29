import React from 'react'
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { FaChevronLeft } from "react-icons/fa6";

const Header = ({ children, content, ...rest }) => {
  const navigate = useNavigate();

  // 이전 페이지 이동
  const goPerv = () => {
    navigate(-1);
  };

  return (
    <Head>
      <Back>
        <FaChevronLeft onClick={goPerv} />
      </Back>
      <Title>
        { children }
      </Title>
    </Head>
  )
}

export default Header


const Title = styled.div`
  font-size: 15px;
  color: black;
  /* font-weight: bold; */
  

`;

const Head = styled.div`
  height: 6vh;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  color: white;
  display: flex;
  align-items: center;
  padding: 1px 20px;
  /* box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); */
  z-index: 100;
`;

const Back = styled.div`
  margin-left: 5px;
  svg {
    color: rgba(128, 128, 128, 0.623);
    &:hover {
      color: black;
      transform: scale(1.1);
    }
  }
`;
