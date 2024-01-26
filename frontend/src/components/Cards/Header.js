import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaChevronLeft } from "react-icons/fa6";
let Head = styled.div`
  /* height: 6vh; */
  position: sticky;
  top: 0;
  /* left: 0;
  right: 0; */
  width: 20.8125rem;
  height: 2.8125rem;
  background-color: white;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1px 20px;
  /* box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); */
  z-index: 100;
`;
let Back = styled.div`
  margin-left: 5px;
  svg {
    color: rgba(128, 128, 128, 0.623);
    &:hover {
      color: black;
      transform: scale(1.1);
    }
  }
`;
let Title = styled.div`
  font-size: 20px;
  color: black;
  /* font-weight: bold; */
`;

let Rank = styled.div`
  color: black;
`;
const Header = () => {
  const locationNow = useLocation();
  let navigate = useNavigate();
  let name = "김싸피";
  // 이전 페이지 이동
  let goPerv = () => {
    navigate(-1);
  };

  return (
    <Head>
      <Back>
        <FaChevronLeft onClick={goPerv} />
      </Back>
      <Title>
        <strong>{name}</strong>님이 모은 카드
      </Title>
      <Rank>랭킹</Rank>
    </Head>
  );
};

export default Header;
