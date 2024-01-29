import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaChevronLeft } from "react-icons/fa6";
let Head = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  /* left: 0;
  right: 0; */
  width: 20.8125rem;
  height: 2.8125rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(5px);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.0625rem 1.25rem;
  /* box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); */
  z-index: 100;
`;
let Back = styled.div`
  margin-left: 0.3125rem;
  svg {
    color: rgba(128, 128, 128, 0.623);
    &:hover {
      color: black;
      transform: scale(1.1);
    }
  }
`;
let Title = styled.div`
  font-size: 1.25rem;
  color: black;
  /* font-weight: bold; */
`;

let Rank = styled.div`
  font-size: 0.875rem;
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
    <>
      <Head>
        <Back>
          <FaChevronLeft onClick={goPerv} />
        </Back>
        <Title>
          <strong>{name}</strong>님이 모은 카드
        </Title>
        <Rank>랭킹</Rank>
      </Head>
    </>
  );
};

export default Header;
